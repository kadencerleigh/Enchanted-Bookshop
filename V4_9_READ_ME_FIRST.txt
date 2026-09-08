Enchanted Bookshop V4.9 — The Collector's Library

Built directly from V4.8.4 Bookshop Learning Brain.

NEW
- Library book cards and magical stacks now open a Collector Library detail view.
- Work → Edition → Copy presentation is derived from existing records; no migration.
- Same title + author records are grouped as one Work.
- Editions group by exact ISBN first, then edition metadata when ISBN is absent.
- Each physical record remains an individual Copy.
- Work panel shows series, genres, reading status, rating, spice, and collection counts.
- Edition panels show edition name, format, publisher, publication date, ISBN, and special features.
- Copy panels show printing, custom cover, cover source, and Bookish Connections.
- Edit Copy preserves the existing editor.
- Add Another Copy clones edition/work facts but clears copy memories/notes.
- Add Another Edition starts a new edition for the same work without altering the existing copy.

SAFETY
- No SQL changes.
- No Supabase schema changes.
- No destructive data migration.
- Existing scanner, Shopping Mode, Learning Brain, cover rescue, backups, and sync remain in place.
- V4.8.4 remains the rollback checkpoint.
