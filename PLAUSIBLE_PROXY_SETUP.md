# Plausible Proxy Setup for TikTok In-App Browser Tracking

## Why You Need This

**Problem:** TikTok's in-app browser blocks third-party analytics scripts like Plausible, causing massive underreporting of your TikTok ad traffic.

**Solution:** Serve Plausible from YOUR domain (braintales.net) instead of plausible.io. This bypasses TikTok's blocks because the requests appear to come from your own site.

**Expected Impact:** TikTok visitor counts should jump significantly closer to what your TikTok ad dashboard shows.

---

## What You Need to Proxy

Two routes need to be proxied from your domain to Plausible:

1. **Script file**: `/js/script.js` → `https://plausible.io/js/script.js`
2. **Event API**: `/api/event` → `https://plausible.io/api/event`

---

## Setup Instructions

### Option 1: Manus Platform (Recommended)

Since you're hosting on Manus, you'll need to ask Manus support if they can add these proxy rules to your deployment configuration:

```
/js/script.js → proxy to https://plausible.io/js/script.js
/api/event → proxy to https://plausible.io/api/event
```

Contact: https://help.manus.im

### Option 2: Cloudflare Workers (If using Cloudflare)

If braintales.net uses Cloudflare, you can set up a Worker:

1. Go to Cloudflare Dashboard → Workers & Pages
2. Create new Worker with this code:

```javascript
export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // Proxy script file
    if (url.pathname === '/js/script.js') {
      return fetch('https://plausible.io/js/script.js', {
        method: request.method,
        headers: request.headers,
      });
    }
    
    // Proxy event API
    if (url.pathname === '/api/event') {
      return fetch('https://plausible.io/api/event', {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });
    }
    
    // Pass through all other requests
    return fetch(request);
  }
}
```

3. Add route: `braintales.net/js/script.js*` and `braintales.net/api/event*`

### Option 3: Vercel (If using Vercel)

Add to `vercel.json` in your project root:

```json
{
  "rewrites": [
    {
      "source": "/js/script.js",
      "destination": "https://plausible.io/js/script.js"
    },
    {
      "source": "/api/event",
      "destination": "https://plausible.io/api/event"
    }
  ]
}
```

### Option 4: Nginx (If using custom server)

Add to your nginx config:

```nginx
location = /js/script.js {
    proxy_pass https://plausible.io/js/script.js;
    proxy_set_header Host plausible.io;
}

location = /api/event {
    proxy_pass https://plausible.io/api/event;
    proxy_set_header Host plausible.io;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

---

## Activate Proxy Mode in Your Site

After setting up the proxy routes:

1. Open `client/index.html`
2. **Comment out** the direct Plausible script (line 15)
3. **Uncomment** the proxy mode script (lines 20-26)

Before:
```html
<!-- CURRENT: Direct Plausible -->
<script defer data-spa="auto" src="https://plausible.io/js/pa-wuRFfVgao7BaT5Fb2CiZe.js"></script>

<!-- PROXY MODE: Uncomment below -->
<!--
<script defer 
        data-spa="auto"
        data-domain="braintales.net"
        data-api="/api/event"
        src="/js/script.js"></script>
-->
```

After:
```html
<!-- CURRENT: Direct Plausible -->
<!-- <script defer data-spa="auto" src="https://plausible.io/js/pa-wuRFfVgao7BaT5Fb2CiZe.js"></script> -->

<!-- PROXY MODE: Uncomment below -->
<script defer 
        data-spa="auto"
        data-domain="braintales.net"
        data-api="/api/event"
        src="/js/script.js"></script>
```

4. Deploy the updated site

---

## Testing

After setup:

1. Visit braintales.net in a normal browser
2. Open DevTools → Network tab
3. Refresh the page
4. Look for requests to `/js/script.js` and `/api/event`
5. They should return 200 OK (not 404)

Test in TikTok:
1. Create a test TikTok post with link to braintales.net
2. Click it from TikTok app
3. Check Plausible dashboard for the visit

---

## Troubleshooting

**404 on /js/script.js or /api/event**
- Proxy routes not configured correctly
- Check your hosting platform's proxy/rewrite documentation

**Still not seeing TikTok traffic**
- Make sure you deployed the updated index.html with proxy mode enabled
- Clear browser cache
- Check that data-domain matches your actual domain

**CORS errors**
- Add CORS headers to your proxy configuration:
  ```
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, POST, OPTIONS
  ```

---

## Additional Resources

- [Official Plausible Proxy Guide](https://plausible.io/docs/proxy/introduction)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Vercel Rewrites Docs](https://vercel.com/docs/projects/project-configuration#rewrites)

---

## Summary

1. Set up proxy routes on your hosting platform
2. Update index.html to use proxy mode
3. Deploy and test
4. Watch TikTok traffic numbers improve dramatically!

