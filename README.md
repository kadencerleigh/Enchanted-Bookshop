# Enchanted Bookshop V4.7.5 — Series Bridge 2.0

Built from the proven V4.7.4 Series Sync Merge stable checkpoint.

## V4.7.5
Series discovery now reuses the normal work-level Google Books search and evaluates matching alternate editions together. If one edition omits series metadata but another matching edition contains a strong series statement, the Bookshop can carry that work-level series claim into the scanned edition as a user-confirmable suggestion.

This specifically addresses the V4.7.3 failure mode where Promises and Pomegranates ISBN 9781464229015 was identified correctly but its newer edition did not expose Monsters & Muses #1 in the selected metadata record.

## Preserved from V4.7.4
- Books and Series Catalogs sync separately by record ID.
- Pull + merge downloads without uploading.
- Sync now performs a two-way merge then uploads the combined state.
- Different series are combined rather than replacing one another.
- Local/offline data remains intact.

No Supabase SQL changes are required for V4.7.5.
