# Enchanted Bookshop V4.7.14.6 — Safe Full-Screen Mobile Scanner Fix

Built from the proven V4.7.14.3 checkpoint.

## Fixes
- Preserves the modal's normal hidden state.
- Full-screen mobile styling applies ONLY while the modal is open.
- Scanner/modal content scrolls inside the phone viewport.
- Close X stays fixed in the top-right and cannot scroll away.
- Mobile More sheet includes an easy-to-see V4.7.14.6 build label.
- Scanner-facing stale version label updated.

## Preserved
- V4.7.14.3 Browse scroll-to-top behavior.
- Hidden Browse scrollbar tracks.
- Mobile bottom navigation and More sheet.
- Existing barcode scanning and exact-edition duplicate detection.
- Work Intelligence preview.
- Books, Series Brain, Work Intelligence, Supabase sync.
- Desktop layout.

## No data changes
No SQL, schema, sync, or book-data changes.

## Test order
1. Refresh the app.
2. Confirm NO blank green modal appears on load.
3. Open More and confirm Enchanted Bookshop · V4.7.14.6.
4. Open Scanner.
5. Scan/identify a book.
6. Scroll far down.
7. Confirm the X remains visible and closes the scanner.
