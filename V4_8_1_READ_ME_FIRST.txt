ENCHANTED BOOKSHOP V4.8.1 — COLLECTOR RESCUE

Built from the proven V4.8.0 Shopping Mode 2.0 checkpoint.

WHAT'S NEW
- Dedicated Edition field (separate from Printing and Format).
- Bookish Connections / Copy Memories on each physical copy.
  - Includes a built-in “Published on my birthday” checkbox.
  - Custom memories can be entered one per line.
- Collector-safe cover rescue:
  1. Existing exact-ISBN recovery still runs first.
  2. If that fails, Enchanted Bookshop searches exact ISBN + title/author cover candidates.
  3. Candidates are shown for YOU to choose.
  4. Same-work candidates are clearly labeled and require confirmation.
  5. Choosing a cover changes only cover fields; no other book data is intentionally changed.
- Shopping Mode comparison now shows Edition and Printing when saved.
- Backup export version bumped to 4.8.1.
- Cache-busting/versioned assets preserved.

NO SUPABASE SQL CHANGES REQUIRED
The app already syncs each book as JSON data, so these new per-copy fields travel inside the existing data payload.

STARSIDE TEST
For your saved Starside copy, open Edit Book → Find Missing Cover. If exact recovery still fails, the new Collector Rescue candidate picker should appear. Pick a cover only if it matches your physical copy.

SAFETY
Do NOT clear Chrome site data/localStorage to update. V4.8.1 preserves the cache-busting lifecycle introduced in V4.7.14.7.
