ENCHANTED BOOKSHOP V4.1 — SERIES BRAIN OWNERSHIP STATES

This is a migration-safe update from V4.

NEW:
- Three series states:
  ✅ Cataloged
  📚 Owned — needs cataloging
  ❌ Missing
- Separate Owned and Cataloged progress
- Collection Complete message
- 'I own this' does NOT create a fake book record
- 'Catalog copy' creates the real book/copy entry
- Ownership state lives in the synced Series Catalog

SUPABASE:
No new SQL is required if V4_SERIES_BRAIN_UPGRADE.sql was already run successfully.

DEPLOY:
Replace the GitHub app files with this V4.1 package, commit to main, then use the service-worker update flow if the installed PWA/browser keeps the old cache.

BACKUP:
Keep your JSON backup. This update continues to use the existing V3 local book-storage key and existing Supabase book + series tables.
