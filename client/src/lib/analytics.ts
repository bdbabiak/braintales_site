// Analytics tracking utility
// TRACKING VERSION
// Functions updated to fire Meta Pixel events.

export function trackPageView(url?: string) {
  if ((window as any).fbq) {
    (window as any).fbq('track', 'PageView');
  }
}

export function trackEvent(eventName: string, eventData?: Record<string, any>) {
  if ((window as any).fbq) {
    (window as any).fbq('trackCustom', eventName, eventData);
  }
}

// Conversion tracking helpers
// These are kept so the "Get on Amazon" buttons don't throw errors when clicked.
export const Analytics = {
  amazonClick: (asin: string, title: string) => {
    // Fire Meta Pixel Event
    if ((window as any).fbq) {
      (window as any).fbq('trackCustom', 'AmazonClick', {
        content_name: title,
        content_id: asin,
        platform: 'Amazon'
      });
    }
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
