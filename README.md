# Enchanted Bookshop V4.7.2 — Series Cleanup Brain

- Normalizes decorated API titles such as `The Selection (The Selection #1)` to the work title.
- Deduplicates alternate metadata records for the same numbered main novel.
- Keeps distinct novellas/extras even when they share a fractional number.
- Labels obvious anthologies/collections separately from individual novellas.
- Preserves V4.7.1 multi-source series discovery and user confirmation.
- No Supabase schema changes.
