// Analytics tracking utility
// Cleaned version: No Google Ads, No Manus/Umami, No Proxy

export function trackPageView(url?: string) {
  // Safe check for standard Plausible (if script is ever present)
  try {
    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible('pageview');
    }
  } catch (error) {
    // Silently fail
  }
}

export function trackEvent(eventName: string, eventData?: Record<string, any>) {
  // Safe check for standard Plausible (if script is ever present)
  try {
    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible(eventName, eventData ? { props: eventData } : undefined);
    }
  } catch (error) {
    // Silently fail
  }
}

// Conversion tracking helpers
// These now only trigger the internal event (safe no-op if no analytics script is loaded)
export const Analytics = {
  amazonClick: (asin: string, title: string) => {
    trackEvent('Amazon Click', { asin, title });
  },
  
  audibleClick: (asin: string, title: string) => {
    trackEvent('Audible Click', { asin, title });
  },

  youtubePlay: (title: string) => trackEvent('YouTube Play', { title }),
  tiktokShare: (title: string) => trackEvent('TikTok Share', { title }),
};
