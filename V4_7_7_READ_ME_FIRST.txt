ENCHANTED BOOKSHOP V4.7.7 — MULTI-SOURCE SERIES BRIDGE + METADATA CACHE

Built from V4.7.6 while preserving the proven V4.7.4 Series Sync Merge behavior.

WHAT CHANGED
- Series discovery starts with the exact ISBN's Open Library work relationship when available.
- Matching Open Library work + edition records are inspected for structured series metadata before Google fallback.
- Google Books is now opportunistic for series detection instead of the primary dependency.
- Google work-search results are reused by enrichment and series discovery, avoiding duplicate requests.
- Successful public metadata responses are cached locally for 7 days, reducing repeated API traffic during rescans.
- Book Intelligence diagnostics show Open Library claims, Google claims, cache hits, and Google rate limiting.
- No title-specific hardcoding for Promises & Pomegranates.
- No Supabase schema changes.

SAFETY
V4.7.4 books + Series Catalog two-way merge behavior is preserved. Do not clear local storage during upgrades.
