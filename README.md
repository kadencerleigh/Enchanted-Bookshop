# Enchanted Bookshop V4.7.7 — Multi-Source Series Bridge + Metadata Cache

Built from V4.7.6 while preserving the proven V4.7.4 Series Sync Merge behavior.

## What changed
- Exact-ISBN Open Library work relationships are the first series-evidence path.
- Open Library work and edition records are inspected before Google fallback.
- Google Books work results are shared/reused instead of requested repeatedly.
- Successful metadata API responses are cached locally for 7 days in a bounded local cache.
- Google Books can be rate-limited without blocking Open Library series evidence.
- Book Intelligence diagnostics report matching editions, usable claims, source claims, cache hits, and Google rate limiting.
- No title-specific hardcoding was added for Promises & Pomegranates.
- No Supabase schema changes.

## Safety
The proven V4.7.4 book + Series Catalog two-way merge behavior is preserved. Keep backups and do not clear local storage during upgrades.
