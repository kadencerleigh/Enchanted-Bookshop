# Enchanted Bookshop V4.7.8 — Work Intelligence Foundation

Built from V4.7.7 while preserving the proven V4.7.4 Series Sync Merge behavior and V4.7.7 multi-source metadata/cache improvements.

## What changed
- Adds a local Work Intelligence Brain keyed by normalized title + author.
- When you save or edit a cataloged book, its work-level genres, tropes/tags, series + number, and non-zero spice rating become confirmed knowledge for that work.
- Future scans of the same work reuse your confirmed knowledge before uncertain public metadata.
- Work Intelligence is separate from edition metadata, so a different ISBN/edition can inherit story-level knowledge without copying edition details.
- Book Intelligence clearly says when it is using your confirmed Work Brain knowledge.
- Work Intelligence is included in JSON backup/restore.
- V4.7.7 Open Library-first discovery, Google fallback, metadata cache, and diagnostics are preserved.
- No title-specific Promises & Pomegranates hardcoding was added.
- No Supabase schema changes in this foundation build. Work Intelligence is local-first and backup-protected; cloud sync can be added as a later migration.

## Safety
V4.7.4 book + Series Catalog sync behavior is preserved. Keep backups and do not clear local storage during upgrades.
