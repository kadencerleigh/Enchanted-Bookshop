# Enchanted Bookshop V4.7.6 — Series Evidence Bridge

Built from V4.7.5 while preserving the proven V4.7.4 Series Sync Merge behavior.

## What changed
- Series discovery now prefers structured series labels before description heuristics.
- Added broader generic parsing for Book/Volume/Part numbering, number words, ordinal wording, and publisher-style series labels.
- Open Library search now requests representative edition metadata, including edition-level series fields when available.
- Google Books discovery limits extra requests and stops the fallback query when usable evidence is already found.
- Book Intelligence now shows a diagnostic line such as `Series search: 8 matching editions • 2 usable series claims`, and reports Google rate limiting when encountered.
- No title-specific hardcoding was added for Promises & Pomegranates.
- No Supabase schema changes.

## Safety
V4.7.4 book + Series Catalog two-way merge behavior is preserved. Keep normal backups and do not clear local storage during upgrades.
