# Enchanted Bookshop V4.7.14.7 — Cache-Busting Scanner Recovery

Built from the proven V4.7.14.3 checkpoint.

## Why this build exists
V4.7.14.5 introduced a CSS rule that could force the modal visible.
Even after replacing the site, Chrome could keep serving that old CSS.
V4.7.14.7 gives CSS and JavaScript explicit versioned URLs so Chrome
must request the new assets.

## Fixes
- styles.css and app.js use explicit ?v=4.7.14.7 cache-busting URLs.
- Modal full-screen treatment applies ONLY when #modal is not .hidden.
- Close X stays fixed at the top-right while modal content scrolls.
- More sheet shows Enchanted Bookshop · V4.7.14.7.
- Service worker activates immediately and claims the page.
- Page navigations are network-first with offline fallback.

## Preserved
- Browse top-position fix and hidden horizontal scrollbars.
- Mobile bottom nav and More sheet.
- Existing scanner/duplicate/Work Intelligence behavior.
- Books, Series Brain, Work Intelligence, Supabase sync.
- Offline fallback.

## No data changes
No SQL, schema, sync, or book-data changes.

## Recovery test
1. Upload this build.
2. Open the site in Chrome.
3. If needed, unregister the old service worker ONCE, then reload.
4. Do NOT clear site data/localStorage.
5. The normal Home screen should appear with no blank green overlay.
6. Open More and confirm V4.7.14.7.
7. Then test Scanner and the X.
