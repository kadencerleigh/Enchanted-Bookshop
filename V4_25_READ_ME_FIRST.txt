ENCHANTED BOOKSHOP V4.25 — CHALLENGE CLOUD SYNC

Built directly from GOLDEN V4.24 Book Detail Glow-Up.

WHAT CHANGED
• Reading Challenge goal/settings now participate in Supabase two-way sync.
• One cloud record is stored per challenge year.
• Newest-updated goal wins during a merge.
• Saving a challenge goal triggers Auto-Sync when Auto-Sync is enabled.
• Manual Sync Now also pulls and pushes Reading Challenges.
• Existing Books, Series Catalogs, and Work Intelligence sync are retained.
• JSON backup/restore remains compatible.

REQUIRED ONE-TIME SUPABASE STEP
Run V4_25_CHALLENGE_CLOUD_SYNC.sql in your Supabase SQL Editor BEFORE testing cloud sync.

SAFETY
• No existing Supabase tables are altered or deleted.
• Row Level Security restricts challenge rows to the signed-in user.
• No local challenge is deleted just because another device syncs.
• No site-data clearing.
• V4.24 Book Detail Glow-Up retained.
• V4.23.5 Atmospheres retained.

FIRST TEST
1. Run V4_25_CHALLENGE_CLOUD_SYNC.sql in Supabase.
2. Deploy V4.25.
3. On one device, set this year's Reading Challenge goal to a recognizable number.
4. Press Sync Now (or leave Auto-Sync on).
5. On the second device, sign into the same Bookshop cloud account and press Sync Now.
6. Confirm the same challenge goal appears.
