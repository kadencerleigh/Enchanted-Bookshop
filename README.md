# Enchanted Bookshop V4.8.0 — Shopping Mode 2.0

Built from the proven V4.7.14.7 functional mobile/desktop checkpoint.

## Shopping Mode 2.0 foundation

Scanner results now give a clearer bookstore decision:

### Exact ISBN
- Red exact-edition warning.
- Side-by-side "Your copy" vs "In your hand".
- High-confidence exact ISBN verdict.
- Keep Browsing action.
- Work Intelligence preview remains available.

### Same work, different ISBN
- Gold "Different Edition" result.
- Side-by-side edition details.
- High confidence that the ISBN/edition differs.
- Explicitly DOES NOT claim special/collector features unless saved metadata supports them.
- Add This Edition action.

### Possible work match
- Purple caution state when title matches but author metadata is incomplete.
- Low-confidence wording instead of pretending the work match is certain.

### New book
- Green new-to-your-bookshop result.
- Add to Bookshop action.
- Clearly states that public metadata can still be incomplete.

### Series-gap signal
When the scanned book maps to a user-confirmed Series Catalog lineup,
Shopping Mode can flag that the book appears to fill a currently missing
series volume and shows owned/lineup progress.

## Safety / preserved systems
- Exact-owned local-first scanner path preserved.
- Existing Google Books + Open Library metadata flow preserved.
- Work Intelligence preserved.
- Series Brain preserved.
- Supabase sync untouched.
- No SQL/schema/data-model changes.
- V4.7.14.7 cache-busting and mobile scanner recovery preserved.
- Desktop layout preserved.

## First test
1. Confirm More shows Enchanted Bookshop · V4.8.0.
2. Scan Promises & Pomegranates.
3. Confirm red EXACT ISBN result and side-by-side comparison.
4. Tap Keep Browsing and confirm scanner closes.
5. Then test a book you do not own if available.

## V4.8.2 — Cover Rescue 2.0
Adds user-supplied physical-cover photos with compression, preview, explicit confirmation, safe cover-only mutation, and backup/cloud compatibility through the existing book record.
