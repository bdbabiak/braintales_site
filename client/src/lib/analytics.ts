// Analytics tracking utility
const ANALYTICS_ENDPOINT = import.meta.env.VITE_ANALYTICS_ENDPOINT;
const WEBSITE_ID = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;

export function trackPageView(url?: string) {
  const pageUrl = url || window.location.pathname + window.location.search;

  // Track with Plausible
  try {
    if (typeof window !== 'undefined' && (window as any).plausible) {
      // Call pageview without parameters - let Plausible use current URL
      (window as any).plausible('pageview');
    }
  } catch (error) {
    // Silently fail
  }

  // Track with Manus/Umami analytics
  if (!ANALYTICS_ENDPOINT || !WEBSITE_ID) {
    return;
  }

  try {
    fetch(`${ANALYTICS_ENDPOINT}/api/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'event',
        payload: {
          website: WEBSITE_ID,
          url: pageUrl,
          referrer: document.referrer || '',
          hostname: window.location.hostname,
          language: navigator.language,
          screen: `${window.screen.width}x${window.screen.height}`,
          title: document.title,
        },
      }),
      keepalive: true,
    }).catch(() => {
      // Silently fail
    });
  } catch (error) {
    // Silently fail
  }
}

export function trackEvent(eventName: string, eventData?: Record<string, any>) {
  // Track with Plausible
  try {
    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible(eventName, eventData ? { props: eventData } : undefined);
    }
  } catch (error) {
    // Silently fail
  }

  // Track with Manus/Umami analytics
  if (!ANALYTICS_ENDPOINT || !WEBSITE_ID) {
    return;
  }

  try {
    fetch(`${ANALYTICS_ENDPOINT}/api/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'event',
        payload: {
          website: WEBSITE_ID,
          url: window.location.pathname + window.location.search,
          name: eventName,
          data: eventData,
        },
      }),
      keepalive: true,
    }).catch(() => {
      // Silently fail
    });
  } catch (error) {
    // Silently fail
  }
}

// --- Helper function for Google Ads Conversion ---
// This is the NEW, correct implementation based on your insights.
const fireGoogleAdsConversion = () => {
  if (typeof (window as any).gtag === 'function') {
    
    // 1. This is the command you were right about.
    // It "sets" the enhanced data, telling the tag to use it.
    (window as any).gtag('set', 'user_data', {
      'address': {
        'country': 'US' // Sending a non-PII field
      }
    });

    // 2. This sends the conversion event.
    (window as any).gtag('event', 'conversion', {
        'send_to': 'AW-17609588022/AtoCCI22g70bELb688xB'
    });
  }
};

// Conversion tracking helpers
export const Analytics = {
  amazonClick: (asin: string, title: string) => {
    trackEvent('Amazon Click', { asin, title });
    fireGoogleAdsConversion();
  },
  
  audibleClick: (asin: string, title: string) => {
    trackEvent('Audible Click', { asin, title });
    fireGoogleAdsConversion();
  },

  youtubePlay: (title: string) => trackEvent('YouTube Play', { title }),
  tiktokShare: (title: string) => trackEvent('TikTok Share', { title }),
};
