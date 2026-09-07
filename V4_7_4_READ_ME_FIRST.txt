Enchanted Bookshop V4.7.4 — Series Sync Merge

WHAT CHANGED
- Pull + merge is now pull-only. It never uploads.
- Sync now does a safe two-way merge of books AND Series Catalogs, then uploads the union.
- Different series are combined rather than one device replacing the other.
- Same-record conflicts keep the newest update.
- No SQL changes are required if V4 Series Brain sync is already working.

DATA-SAFE TEST
1. Keep your fresh backups.
2. Upload this build to GitHub Pages. Do NOT clear site data/localStorage.
3. Confirm the app says V4.7.4 • Series Sync Merge.
4. On the PHONE (the device that still has The Selection lineup), press Sync now once.
   Expected: it pulls AGGGTM from cloud, keeps The Selection locally, then uploads both lineups.
5. On the COMPUTER, press Pull + merge.
   Expected: both The Selection and AGGGTM lineups appear.
6. Do not turn Auto-sync on yet; verify the benchmark first.
