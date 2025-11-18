// Analytics tracking utility
// ZERO TRACKING VERSION
// All functions are empty no-ops to preserve application structure without tracking.

export function trackPageView(url?: string) {
  // No-op
}

export function trackEvent(eventName: string, eventData?: Record<string, any>) {
  // No-op
}

// Conversion tracking helpers
// These are kept so the "Get on Amazon" buttons don't throw errors when clicked.
export const Analytics = {
  amazonClick: (asin: string, title: string) => {
    // No-op
  },
  
  audibleClick: (asin: string, title: string) => {
    // No-op
  },

  youtubePlay: (title: string) => {
    // No-op
  },
  
  tiktokShare: (title: string) => {
    // No-op
  },
};
