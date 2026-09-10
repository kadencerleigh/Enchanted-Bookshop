ENCHANTED BOOKSHOP V4.30.0 — FINAL CLEANUP

Targeted approved fixes only:
1. Wrong-cover correction: Edit Book now shows “Change / Fix Cover” for existing books, even when a cover already exists. It searches exact ISBN and title/author candidates and keeps the existing “Use My Own Cover” fallback. Only cover fields change when a candidate/photo is confirmed.
2. Spice truth: Unknown is now a separate editable state. Numeric 0 explicitly means Clean. Public metadata with insufficient evidence remains Unknown instead of silently becoming Clean. Manual numeric choices, including 0, are confirmed by the user.

No schema/SQL changes. Backup payload compatibility remains 4.22.1.
