# Enchanted Bookshop V4.7.9 — Cover Recovery + Work Brain Preview

Built from V4.7.8 while preserving the proven V4.7.4 Series Sync Merge.

## What changed
- Fixed Work Intelligence recall so confirmed genres and series/series number actually override weak public metadata on a rescan.
- Exact-ISBN duplicate warnings now include **🧠 Preview Work Intelligence**. The preview is read-only and does not add another copy.
- Added safe **✨ Recover cover** action when a rescan finds a usable cover candidate that differs from the saved copy.
- Open Library ISBN lookup no longer invents a cover URL when that edition has no cover ID; this allows real work/edition cover fallbacks to be discovered.
- Cover recovery validates that the candidate image actually loads before saving it.
- Backup/export version bumped to 4.7.9.
- No Supabase SQL changes.
- No hardcoded Promises & Pomegranates data.

## Test benchmark
Scan ISBN 9781464229015 after the existing copy is already cataloged.
Expected:
1. Exact-edition warning remains.
2. Preview Work Intelligence shows confirmed Bookshop Brain knowledge (Monsters & Muses #1, confirmed genres/tags/spice).
3. If a usable cover candidate is discovered, Recover cover appears and can repair the existing record without creating a duplicate.
