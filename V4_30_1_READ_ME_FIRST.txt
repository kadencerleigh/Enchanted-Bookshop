Enchanted Bookshop V4.30.1 — Series Catalog Delete Maintenance Patch

Adds a targeted Delete Series Catalog control inside Edit lineup.
- Requires confirmation.
- Deletes only the selected Series Catalog record.
- Does NOT delete books, ownership, reading history, or other series.
- Uses the selected catalog record ID so similarly named duplicate catalogs can be handled separately.
- Deletion is retained as a sync tombstone so it can propagate through Supabase sync.

No schema or SQL changes. Backup payload compatibility remains 4.22.1.
