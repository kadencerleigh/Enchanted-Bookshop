# Enchanted Bookshop V4.7.14.5 — Full-Screen Mobile Scanner Fix

Built from the proven V4.7.14.3 checkpoint.

## What changed
- Scanner modal becomes a true full-screen mobile layer.
- Close X is fixed to the top-right of the viewport and cannot scroll away.
- Scanner content scrolls underneath the persistent close control.
- Scanner title spacing adjusted for the persistent controls.
- Scanner label updated to V4.7.14.5.
- Mobile More sheet gets an easy-to-see build/version label.

## Preserved
- Browse opens at the top.
- Browse gray scrollbar tracks remain hidden.
- Mobile bottom navigation and More sheet.
- Existing barcode scanner behavior.
- Exact-edition duplicate detection.
- Work Intelligence preview.
- Books, Series Brain, Work Intelligence, Supabase sync.
- Desktop layout.

## No data changes
No SQL, schema, sync, or book-data changes.

## Test
1. Open More and confirm it shows Enchanted Bookshop · V4.7.14.5.
2. Open Scanner from bottom nav.
3. Scan/identify Promises & Pomegranates.
4. Scroll far down through the result.
5. Confirm the X remains visible in the top-right.
6. Tap X and confirm the scanner closes.
