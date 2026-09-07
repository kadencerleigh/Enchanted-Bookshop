# Enchanted Bookshop V4.7.10.3 — Cover Candidate Refresh

Built from V4.7.10.2.

## What changed
- Exact-owned books with no saved cover now ALWAYS show:
  `✨ Find / Recover Cover`
- The cover search is now user-triggered instead of relying on a silent background refresh.
- Clicking the button:
  1. searches exact ISBN metadata,
  2. checks Open Library + Google Books,
  3. enriches edition/work candidates,
  4. validates the candidate image,
  5. saves only the cover fields if safe.
- Duplicate detection remains local-first and fast.
- No cover search happens until you click the button.
- Work-level fallback still requires confirmation.
- Non-cover book fields remain protected by rollback safety.
- Preserves V4.7.10.1 Work Brain behavior and V4.7.4 Series Sync Merge.
- No Supabase SQL changes.
- No title-specific hardcoding.

## Boss test
1. Confirm `V4.7.10.3 • Cover Candidate Refresh` is live.
2. Scan ISBN `9781464229015`.
3. Exact duplicate screen should appear quickly.
4. `✨ Find / Recover Cover` should now be visible even though the saved copy has no cover.
5. Click it.
6. Expect either:
   - verified cover recovered, or
   - a safe no-match message, or
   - a confirmation prompt for a work-level fallback.
7. Check My Library.
8. Confirm all saved metadata is unchanged.

Do NOT clear site data.
