# Enchanted Bookshop V4.7.10.1 — Bootstrap Hotfix

Built directly from V4.7.10.

## What this hotfix fixes
- Fixes the V4.7.10 Work Brain bootstrap crash caused by a call to a nonexistent `setWorkIntelligence()` helper.
- Exact ISBNs already in My Library are now resolved LOCAL-FIRST.
  - No Google Books wait.
  - No Open Library wait.
  - No series-discovery wait.
  - Duplicate warning should appear almost immediately.
- Work Brain is bootstrapped only when it is actually needed instead of migrating the entire library during render.
- Metadata cache requests now have an 8-second abort timeout so a dead endpoint cannot spin forever.
- Preserves V4.7.9 cover recovery code and the proven V4.7.4 series sync foundation.
- No Supabase SQL changes.
- No title-specific hardcoding.

## Promises & Pomegranates benchmark
Scan ISBN: 9781464229015

Expected:
1. Exact duplicate warning appears quickly from the local catalog.
2. Click `🧠 Preview Work Intelligence`.
3. Preview should use the saved cataloged copy:
   - Monsters & Muses #1
   - Romance + Dark Romance
   - saved tropes/tags
   - 5/5 spice
   - Source: Confirmed in your Bookshop Brain / cataloged copy

Note: because exact-owned scans now short-circuit locally, online cover recovery is intentionally not part of this boss test. First prove memory is stable; cover recovery can be tested separately afterward.
