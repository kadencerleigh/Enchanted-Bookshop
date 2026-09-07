ENCHANTED BOOKSHOP V4.7.5 — SERIES BRIDGE 2.0

Built from the V4.7.4 stable checkpoint.

WHAT CHANGED
- Work-level Google Books enrichment now examines ALL matching editions returned by the existing title + author lookup instead of trusting only the single best edition.
- Series claims from alternate editions are aggregated before a series is suggested.
- This lets a newer ISBN inherit trustworthy work-level series metadata from an older edition when the newer edition omits it.
- Automatically discovered series data remains marked as a suggestion/possible match for user confirmation.
- Existing V4.7.4 books + Series Catalog two-way merge is preserved unchanged.
- Reduces the need for extra Google Books bridge requests, helping avoid the 429 rate-limit problem seen during V4.7.3 testing.

BENCHMARK
ISBN 9781464229015 — Promises and Pomegranates by Sav R. Miller
Expected series suggestion: Monsters & Muses #1.

NO SUPABASE SQL CHANGES.
DO NOT clear browser/site data.
Keep Auto-sync OFF while testing.
