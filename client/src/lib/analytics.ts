// Analytics tracking utility
// TRACKING VERSION
// Functions updated to fire Meta Pixel (fbq) and Signals Gateway (cbq) events.

export function trackPageView(url?: string) {
  if ((window as any).fbq) {
    (window as any).fbq('track', 'PageView');
  }
  if ((window as any).cbq) {
    (window as any).cbq('track', 'PageView');
  }
}

export function trackEvent(eventName: string, eventData?: Record<string, any>) {
  if ((window as any).fbq) {
    (window as any).fbq('trackCustom', eventName, eventData);
  }
  if ((window as any).cbq) {
    (window as any).cbq('trackCustom', eventName, eventData);
  }
}

// Conversion tracking helpers
export const Analytics = {
  amazonClick: (asin: string, title: string) => {
    const eventParams = {
      content_name: title,
      content_id: asin,
      platform: 'Amazon'
    };

    // Fire Meta Pixel Event
    if ((window as any).fbq) {
      (window as any).fbq('trackCustom', 'AmazonClick', eventParams);
    }

    // Fire Signals Gateway Pixel Event
    if ((window as any).cbq) {
      (window as any).cbq('trackCustom', 'AmazonClick', eventParams);
    }
  },
  
  audibleClick: (asin: string, title: string) => {
    // No-op or add similar tracking if needed
  },

  youtubePlay: (title: string) => {
    // No-op
  },
  
  tiktokShare: (title: string) => {
    // No-op
  },
};
