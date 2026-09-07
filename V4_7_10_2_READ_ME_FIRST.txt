# Enchanted Bookshop V4.7.10.2 — Exact Cover Recovery

Built from the proven V4.7.10.1 hotfix.

## What changed
- Exact-owned ISBN scans still resolve instantly from the local catalog.
- Cover discovery now runs in the background so it never blocks duplicate recognition.
- Cover recovery priority:
  1. exact ISBN / identified edition
  2. matching edition candidates
  3. exact Open Library ISBN cover
  4. work-level fallback
- Work-level fallback is explicitly labeled and requires confirmation.
- Candidate images are actually loaded/validated before saving.
- Recovery changes ONLY cover-related fields.
- A safety comparison automatically rolls back if any non-cover book data changes unexpectedly.
- External image validation times out after 5 seconds.
- Preserves V4.7.10.1 Work Brain bootstrap and V4.7.4 Series Sync Merge.
- No Supabase SQL changes.
- No title-specific hardcoding.

## Boss test
For Promises & Pomegranates (ISBN 9781464229015):
1. Confirm V4.7.10.2 is live.
2. Scan the ISBN.
3. Exact duplicate warning should appear quickly.
4. Click `✨ Recover cover`.
5. Confirm a cover is recovered or a safe no-match message appears.
6. Open My Library and verify the cover displays.
7. Reopen the book and confirm series, genres, tags, spice, page count, format, ISBN, notes, and reading data are unchanged.
8. Refresh once and verify the cover persists.

Do not clear site data.
