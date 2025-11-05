import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { bookRatingsCache, settings } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

interface RainforestProduct {
  asin: string;
  rating?: number;
  ratings_total?: number;
}

interface CachedRating {
  asin: string;
  rating: number;
  reviews: number;
  lastFetched: Date;
}

// Master list of all 14 books (user-provided ASINs)
const ALL_BOOK_ASINS = [
  'B0FSSW9XGX', // The Doubles
  'B0FVF3ZRJQ', // Epicurus 2.0
  'B0FWTY1VVS', // The ADHD Brain
  'B0FXT51Y14', // Trading Psychology & Neuroscience
  'B0FS9Y48RX', // The Last Beautiful Game
  'B0FN3M4DFZ', // The Sight Eater
  'B0FP9MRCJM', // Grandma's Illegal Dragon Racing Circuit
  'B0FLT5SKPL', // Familiar System
  'B0FMPYTC8H', // A Kind of Forgery
  'B0FNM5TB9Y', // Momentum Wars
  'B0FMXKQ8BJ', // Chronophage
  'B0FNCPTGPS', // Everything Thinks
  'B0FR32348P', // Last Channel of Nana Quantum
  'B0FQTGSFJG', // Quantum Sock Mismatch
];

// In-memory cache of all book ratings
let ratingsCache: CachedRating[] = [];
let cacheInitialized = false;
let refreshInProgress = false;
let globalLastRefresh: Date | null = null; // one-row 'settings' mirror

/**
 * Initialize cache from database on server startup
 */
async function initializeCache() {
  if (cacheInitialized) return;
  
  try {
    const db = await getDb();
    if (!db) {
      console.warn("[Cache] Database not available");
      cacheInitialized = true;
      return;
    }
    
    const cached = await db.select().from(bookRatingsCache);
    ratingsCache = cached
      .filter(c => c.rating !== null && c.rating !== undefined && c.reviewCount !== null && c.reviewCount !== undefined)
      .map(c => ({
        asin: c.asin,
        rating: parseFloat(c.rating!),
        reviews: c.reviewCount!,
        lastFetched: c.lastFetched,
      }));
    
    // Load global last refresh if present
    const s = await db.select().from(settings).where(eq(settings.key, "ratings_last_refresh")).limit(1);
    if (s.length && s[0].value) {
      const d = new Date(s[0].value);
      if (!Number.isNaN(d.getTime())) {
        globalLastRefresh = d;
      }
    }
    
    cacheInitialized = true;
    console.log(`[Cache] Initialized with ${ratingsCache.length} ratings`);
  } catch (error) {
    console.error("[Cache] Failed to initialize:", error);
    cacheInitialized = true;
  }
}

/**
 * Fetch rating from Rainforest API
 */
async function fetchAmazonRating(asin: string): Promise<{ asin: string; rating: number; reviews: number } | null> {
  const apiKey = process.env.RAINFOREST_API_KEY;
  
  if (!apiKey) {
    console.warn("[API] RAINFOREST_API_KEY missing; skipping");
    return null;
  }

  try {
    const params = new URLSearchParams({
      api_key: apiKey,
      type: "product",
      amazon_domain: "amazon.com",
      asin: asin,
    });

    const response = await fetch(`https://api.rainforestapi.com/request?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`[API] Error for ${asin}:`, response.status);
      return null;
    }

    const data = await response.json();
    const product = data.product as RainforestProduct;

    if (!product) return null;

    // Accept entries even if reviews === 0
    const reviews = product.ratings_total ?? 0;
    // If Amazon provides a rating number, use it. If not (e.g., 0 reviews), set 0.
    const rating = typeof product.rating === "number" ? product.rating : 0;

    console.log(`[API] Fetched ${asin}: ${rating}★ (${reviews} reviews)`);
    return { asin, rating, reviews };
  } catch (error) {
    console.error(`[API] Error fetching ${asin}:`, error);
    return null;
  }
}

/**
 * Refresh all ratings from API in background
 */
async function refreshAllRatings() {
  if (refreshInProgress) {
    console.log("[Cache] Refresh already in progress, skipping");
    return;
  }
  
  refreshInProgress = true;
  console.log("[Cache] Starting refresh of all ratings");
  const startTime = Date.now();
  
  let successCount = 0;
  let failCount = 0;
  
  for (const asin of ALL_BOOK_ASINS) {
    try {
      const rating = await fetchAmazonRating(asin);
      
      if (rating) {
        // Update in-memory cache
        const existingIndex = ratingsCache.findIndex(r => r.asin === asin);
        const newEntry: CachedRating = {
          ...rating,
          lastFetched: new Date(),
        };
        
        if (existingIndex >= 0) {
          ratingsCache[existingIndex] = newEntry;
        } else {
          ratingsCache.push(newEntry);
        }
        
        // Update database
        const db = await getDb();
        if (db) {
          const existing = await db.select().from(bookRatingsCache).where(eq(bookRatingsCache.asin, asin)).limit(1);
          
          if (existing.length > 0) {
            await db.update(bookRatingsCache)
              .set({
                rating: rating.rating.toString(),
                reviewCount: rating.reviews,
                lastFetched: new Date(),
              })
              .where(eq(bookRatingsCache.asin, asin));
          } else {
            await db.insert(bookRatingsCache).values({
              asin,
              rating: rating.rating.toString(),
              reviewCount: rating.reviews,
              lastFetched: new Date(),
            });
          }
        }
        
        successCount++;
      } else {
        failCount++;
      }
      
      // Rate limiting: wait 100ms between API calls
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`[Cache] Error refreshing ${asin}:`, error);
      failCount++;
    }
  }
  
  const duration = Math.round((Date.now() - startTime) / 1000);
  console.log(`[Cache] Refresh complete: ${successCount} success, ${failCount} failed (${duration}s)`);
  refreshInProgress = false;
  
  // Update global last refresh IFF we refreshed at least one successfully
  if (successCount > 0) {
    const db = await getDb();
    const now = new Date();
    globalLastRefresh = now;
    if (db) {
      const row = await db.select().from(settings).where(eq(settings.key, "ratings_last_refresh")).limit(1);
      if (row.length) {
        await db.update(settings)
          .set({ value: now.toISOString(), updatedAt: new Date() })
          .where(eq(settings.key, "ratings_last_refresh"));
      } else {
        await db.insert(settings).values({
          key: "ratings_last_refresh",
          value: now.toISOString(),
        });
      }
    }
  }
}

/**
 * Check if cache needs refresh (>6 hours old)
 */
function needsRefresh(): boolean {
  const now = Date.now();
  const sixHoursInMs = 6 * 60 * 60 * 1000;
  
  // Prefer global timestamp if available
  if (globalLastRefresh) {
    return now - globalLastRefresh.getTime() > sixHoursInMs;
  }
  
  // Fallback: infer from per-book oldest entry
  if (ratingsCache.length === 0) return true; // cold start
  const oldestCache = ratingsCache.reduce((oldest, current) =>
    current.lastFetched < oldest.lastFetched ? current : oldest
  );
  return now - oldestCache.lastFetched.getTime() > sixHoursInMs;
}

export const booksRouter = router({
  getRatings: publicProcedure
    .input(z.object({ asins: z.array(z.string()) }))
    .query(async ({ ctx, input }) => {
      // Initialize cache on first request
      if (!cacheInitialized) {
        await initializeCache();
      }
      
      // Gate refresh by visitor IP (skip home/office etc.)
      const xf = (ctx.req.headers["x-forwarded-for"] as string | undefined) || "";
      const forwardedIp = xf.split(",")[0]?.trim();
      const remoteIp = forwardedIp || ctx.req.ip || ctx.req.socket.remoteAddress || "";
      const blocked = (process.env.BLOCK_REFRESH_IPS || "")
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);
      const canTrigger = !blocked.some(bad => remoteIp.includes(bad));
      
      // Trigger background refresh if needed (non-blocking) and allowed
      if (canTrigger && needsRefresh() && !refreshInProgress) {
        refreshAllRatings().catch(err => console.error("[Cache] Refresh error:", err));
      }
      
      // Return cached ratings for requested ASINs
      return input.asins
        .map(asin => ratingsCache.find(r => r.asin === asin))
        .filter((r): r is CachedRating => r !== undefined);
    }),
  
  clearCache: publicProcedure
    .mutation(async () => {
      try {
        const db = await getDb();
        if (!db) {
          return { success: false, message: "Database not available" };
        }
        
        // Clear database cache
        await db.delete(bookRatingsCache);
        
        // Clear in-memory cache
        ratingsCache = [];
        
        console.log("[Cache] Cleared all cached ratings");
        return { success: true, message: "Cache cleared successfully" };
      } catch (error) {
        console.error("[Cache] Error clearing cache:", error);
        return { success: false, message: "Failed to clear cache" };
      }
    }),
});

