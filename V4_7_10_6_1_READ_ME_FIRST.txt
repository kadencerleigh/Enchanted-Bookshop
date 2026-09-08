# Enchanted Bookshop V4.7.10.6.1 — Cover Repair Hotfix

This fixes the reason the V4.7.10.6 button stayed hidden for Promises and Pomegranates.

Promises has a cover value stored, but the image itself is unusable. V4.7.10.6 only
showed the repair button when the cover value was completely blank.

V4.7.10.6.1:
- shows `✨ Find Missing Cover` for an existing book with an ISBN
- checks whether the currently saved cover actually loads
- if the saved cover is broken, reuses the proven V4.7.10.5 ISBN cover enrichment
- reads the ISBN from the real Edit Book form field
- preserves the existing book and protects non-cover metadata

No Supabase SQL changes.
No sync changes.
Do NOT clear site data.

Test one step at a time:
1. Confirm V4.7.10.6.1 is live.
2. My Library → Promises and Pomegranates → Edit.
3. Scroll to the bottom.
4. Confirm `✨ Find Missing Cover` appears.
5. Stop before clicking it if you want to verify the UI first.
