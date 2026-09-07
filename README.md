# Enchanted Bookshop V4.7.3 — Book Intelligence ↔ Series Brain Bridge

- Adds a generic work-level series discovery pass after ISBN/edition identification.
- Searches multiple Google Books result sets plus Open Library series metadata.
- Aggregates and scores independent series claims rather than trusting the first hit.
- Prefills a likely series + number only when evidence crosses a confidence threshold.
- Marks automatically discovered series as **possible — confirm below** before the book is saved.
- Keeps V4.7.2 Series Cleanup Brain, unknown-spice behavior, read-before-tracking, backup, and sync features.
- `Promises and Pomegranates` is NOT hardcoded; it remains the benchmark.
- No Supabase schema changes.


## V4.7.4 — Series Sync Merge

This build focuses on safe cross-device Series Catalog synchronization.

- Pull + merge is now truly pull-only: it downloads cloud records and merges them locally without uploading.
- Sync now performs a two-way merge for both books and Series Catalog records, then uploads the combined result.
- Different series IDs are preserved together, so a phone-only lineup and a computer-only lineup can become one union in the cloud.
- Conflicts for the same record ID use `updatedAt` / cloud `updated_at`; the newer copy wins.
- Local/offline data remains intact.
- No new Supabase SQL is required if V4 Series Brain sync is already installed.

Recommended benchmark: with The Selection only on the phone and A Good Girl's Guide to Murder only in cloud/computer, run **Sync now on the phone**, then **Pull + merge on the computer**. Both devices should then show both lineups.
