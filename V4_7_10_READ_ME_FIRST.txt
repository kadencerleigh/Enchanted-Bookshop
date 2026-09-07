# Enchanted Bookshop V4.7.10 — Work Brain Bootstrap

Built from V4.7.9 while preserving the proven V4.7.4 Series Sync Merge.

## What changed
- Work Brain can now bootstrap itself from an already-cataloged copy if no separate Work Intelligence record exists yet.
- Existing cataloged books are lazily migrated into Work Intelligence on first render.
- Exact-ISBN duplicate previews now force a bootstrap check before showing Work Intelligence.
- Confirmed catalog data such as series, series number, genres, tags, and spice can be reused without deleting/re-adding the book.
- The preview remains read-only and does not create a duplicate.
- V4.7.9 cover recovery is preserved.
- No Supabase SQL changes.
- No hardcoded Promises & Pomegranates data.

## Benchmark
Rescan ISBN 9781464229015 after Promises & Pomegranates is already in the library.
Expected Work Intelligence preview:
- Series: Monsters & Muses #1
- Genres: Romance • Dark Romance
- Tropes/tags: the saved confirmed tags
- Spice: 5/5
- Source: Confirmed in your Bookshop Brain / confirmed cataloged copy
