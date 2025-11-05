import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Cache table for Amazon book ratings to reduce API calls.
 * Refreshed 4 times daily (every 6 hours).
 */
export const bookRatingsCache = mysqlTable("bookRatingsCache", {
  id: int("id").autoincrement().primaryKey(),
  /** Amazon ASIN */
  asin: varchar("asin", { length: 20 }).notNull().unique(),
  /** Average rating (e.g., 4.5) */
  rating: varchar("rating", { length: 10 }),
  /** Number of reviews */
  reviewCount: int("reviewCount"),
  /** Last time this was fetched from Amazon */
  lastFetched: timestamp("lastFetched").defaultNow().notNull(),
  /** When this record was created */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BookRatingCache = typeof bookRatingsCache.$inferSelect;
export type InsertBookRatingCache = typeof bookRatingsCache.$inferInsert;

/**
 * Small key/value store for site-wide settings.
 * We'll use key='ratings_last_refresh' to record last completed refresh time.
 */
export const settings = mysqlTable("settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 64 }).notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Setting = typeof settings.$inferSelect;
export type InsertSetting = typeof settings.$inferInsert;