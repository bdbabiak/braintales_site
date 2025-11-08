# Project TODO

- [x] Copy book cover images to project public directory
- [x] Design and implement hero section with author photo
- [x] Create book showcase section with circular layout for 5 books
- [x] Add compelling bullet-point blurbs for each book
- [x] Implement Amazon purchase buttons for each book
- [x] Style website similar to ADHD website aesthetic
- [x] Ensure responsive design for mobile and desktop
- [x] Test all Amazon links


- [x] Add embedded YouTube videos to each book card
- [x] Extract and update book descriptions from YouTube video content
- [x] Ensure video embeds are responsive and work well in the card layout


- [x] Add The Sight Eater book cover to public directory
- [x] Extract video content from The Sight Eater YouTube video
- [x] Add The Sight Eater as sixth book card with embedded video
- [x] Update book count and layout for 6 books


- [x] Update The Doubles video link to new YouTube short


- [x] Update Trading Psychology & Neuroscience video link to new YouTube short


- [x] Fix ADHD Brain video link (restore a06lqBas4gE)


- [x] Add search bar component at top of page
- [x] Implement search filtering by title and keywords
- [x] Add search state management and UI feedback


- [x] Create About the Author page with bio
- [x] Add navigation to About page
- [x] Create Featured Book section highlighting The ADHD Brain
- [x] Add Amazon ratings to book cards
- [x] Enhance hover effects with zoom and shadow
- [x] Create Themes page listing common themes across books
- [x] Add navigation to Themes page


- [x] Upgrade project to server template
- [x] Implement backend API endpoint for Amazon ratings (mock data for now)
- [x] Integrate Rainforest API for real-time ratings
- [x] Update frontend to fetch ratings from backend


- [x] Fix reversed Amazon links for Trading Psychology and Epicurus books
- [x] Implement actual Rainforest API calls (waiting for valid API key)
- [x] Update ASIN mappings to match correct Amazon links


- [x] Update About page with new doctor photo (injectionshotmedoc.jpg)


- [x] Debug why Rainforest API is not fetching real data despite valid API key
- [x] Test API calls and fix any integration issues


- [x] Investigate why analytics show zero page views despite thousands of ad clicks
- [x] Check if analytics tracking is properly configured
- [x] Verify analytics endpoint is working


- [x] Fix analytics "Failed to fetch" error
- [x] Update analytics tracking to handle errors gracefully


- [x] Add social media share buttons to all book cards
- [x] Implement share functionality for Twitter, Facebook, LinkedIn
- [x] Style share buttons to match website design


- [x] Add TikTok, Instagram, and Bluesky share buttons
- [x] Reorder share buttons: TikTok, X, Facebook, LinkedIn, Bluesky, Instagram


- [x] Implement Web Share API for native mobile sharing
- [x] Add primary "Share" button that uses Web Share API
- [x] Keep platform-specific buttons as secondary options


- [x] Remove Web Share API button
- [x] Replace with dedicated platform buttons: TikTok, X, Facebook, LinkedIn, Bluesky
- [x] Remove Instagram button
- [x] Ensure TikTok button is first and prominent


- [x] Redesign navigation to make About and Themes much more prominent
- [x] Add visual elements to catch attention at the top of the page
- [x] Ensure navigation is noticeable to the 86% who don't scroll down


- [x] Remove hamburger menu on mobile
- [x] Show colorful navigation buttons directly on mobile without hiding them


- [ ] Investigate if removing Web Share API broke analytics tracking
- [ ] Check git history for what changed when Web Share API was removed
- [ ] Fix analytics if broken by Web Share API removal


- [x] Integrate Plausible analytics script into website
- [x] Add Plausible tracking to index.html
- [x] Test Plausible analytics is working


- [x] Fix Plausible script to include data-domain="braintales.net"



- [x] Change homepage "All Books" section to "Top Books" with new tagline
- [x] Add "View All Books" link at bottom of homepage pointing to amazon.com/author/babiak
- [x] Implement caching system for Rainforest API (refresh 4x daily instead of every page load)
- [x] Create Series page with 3 book series
- [x] Add Impossible Systems series with books to Series page
- [x] Add The Absurd Quantum Chronicles series to Series page
- [x] Add Neuroscience and Psychiatry in Fiction series to Series page
- [x] Fetch cached Amazon ratings for all series books
- [x] Create Audiobooks page with author video and audiobook showcase
- [x] Add 5 current audiobooks with dramatic scene images
- [x] Fetch cached Amazon ratings for audiobooks
- [x] Add mention of 5 upcoming audiobooks releasing in 2 weeks
- [x] Add Series link to navigation
- [x] Add Audiobooks link to navigation
- [x] Update Themes page to include audiobooks and series books
- [x] Copy uploaded video and images to project assets
- [ ] Test caching system reduces API usage to ~4 calls per day per book



- [x] Fix nested anchor tag error on Series page (Link wrapping <a>)



- [x] Fix audiobooks page - add cinematic images with cover overlays in lower right corner
- [x] Add proper audiobook descriptions and create compelling taglines with bullet points
- [x] Copy all uploaded covers and images to project
- [x] Update series page with correct books for all 3 series
- [x] Make Series and Audiobooks navigation buttons colorful like About and Themes
- [x] Add navigation links to top and bottom of every page
- [x] Replace welcome video with correct file (videoofmewavingandsmilingatviewer.mp4)



- [x] Add colorful navigation buttons to bottom of Home page
- [x] Change "View Series on Amazon" to "Get Series on Amazon" and make bigger on Series page
- [x] Remove individual "Get on Amazon" buttons for series books
- [x] Add cover images and bullet points for each series book
- [x] Add colorful navigation buttons to top of About page
- [x] Add colorful navigation buttons to top and bottom of all pages
- [x] Make video autoplay on Audiobooks page
- [x] Remove Audible icon from "Available on" list on Audiobooks page
- [x] Update Themes page with new audiobook titles in appropriate theme boxes
- [x] Update Themes page with new series book titles in appropriate theme boxes



- [x] Remove "(Audiobook)" descriptor from all book titles on Themes page
- [x] Fix bottom navigation buttons on Audiobooks page
- [x] Verify video autoplay works on Audiobooks page
- [x] Add scroll-to-top on page load for all pages
- [x] Redesign Series page: 3 books in horizontal row with cover, title, cached reviews, bullets
- [x] Add cached Amazon reviews to Series page books
- [x] Reorder series: Neuroscience first, Impossible Systems second, Absurd third
- [x] Fix Absurd series book order: Grandma (1), Quantum Sock (2), Nana Quantum (3)



- [x] Add colorful navigation buttons to top of Series page
- [x] Add colorful navigation buttons to top of Audiobooks page



- [x] Verify Home page is using cached ratings (not calling API on every page load)
- [x] Verify Series page is using cached ratings (not calling API on every page load)
- [x] Verify Audiobooks page is using cached ratings (not calling API on every page load)
- [x] Fix any pages that are calling Rainforest API directly instead of using cache
- [x] Add staleTime to React Query to prevent unnecessary refetches



- [x] Fix Series page calling Rainforest API on every visitor (should use cache)
- [x] Investigate why Series page is bypassing cache despite staleTime setting
- [x] Memoize ASIN arrays on all pages to prevent React Query cache invalidation



## Programmer Feedback Implementation
- [x] Fix MySQL database connection using mysql2 pool instead of URL string
- [x] Fix 0-review handling in initializeCache (don't filter out 0 reviews)
- [x] Fix 0-review handling in fetchAmazonRating (accept ratings_total === 0)
- [x] Format ratings to 1 decimal place on all pages
- [x] Add logging when RAINFOREST_API_KEY is missing
- [x] Hide ratings display when reviews === 0 (books without reviews yet)
- [ ] Test database persistence after fixes



## Top 3 Improvements (Programmer Feedback Round 2)
- [x] Add trust proxy setting to server/_core/index.ts
- [x] Create settings table in drizzle/schema.ts
- [x] Create migration for settings table
- [x] Add global last refresh logic to books router
- [x] Add IP gating to prevent own visits from triggering refreshes
- [ ] Set BLOCK_REFRESH_IPS environment variable
- [ ] Test that IP gating works correctly



## Plausible Analytics Fixes
- [x] Fix double pageview tracking (add data-spa="auto" to Plausible script)
- [x] Remove manual trackPageView from App.tsx useEffect
- [x] Add trackEvent helper function to analytics.ts (now tracks both Plausible and Umami)
- [x] Add Analytics.amazonClick and Analytics.audibleClick helpers
- [x] Wire Amazon click events into Home page
- [x] Wire Amazon click events into Series page
- [x] Wire Audible click events into Audiobooks page
- [ ] Document: Set up Goals in Plausible dashboard (Amazon Click, Audible Click)
- [ ] Document: Consider TikTok proxy setup for better tracking
- [ ] Optional: Remove Umami tracker if not needed



## TikTok Proxy Setup for Plausible
- [x] Update index.html with proxy-ready Plausible configuration
- [x] Create PLAUSIBLE_PROXY_SETUP.md documentation
- [x] Document proxy routes needed (/js/script.js, /api/event)
- [x] Explain how to set up on Manus/Vercel/Cloudflare/Nginx



## Fix Inconsistent Conversion Events (Programmer Feedback Round 3)
- [x] Home.tsx: Only has Amazon links (no Audible) - already has amazonClick ✓
- [x] Series.tsx: Only has Amazon links (no Audible) - already has amazonClick ✓
- [x] Audiobooks.tsx: Added amazonClick alongside audibleClick (links go to Amazon/Audible)
- [x] All pages now track appropriate conversion events
- [ ] Test that events fire correctly in browser console

