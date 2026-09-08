# Enchanted Bookshop V4.7.10.6.2 — Forced Cover Refresh

The `✨ Find Missing Cover` button now trusts the user, not the old image URL.

If you click it:
- the existing cover value is temporarily ignored
- the app reruns the proven V4.7.10.5 ISBN cover enrichment
- only cover / coverSource / updatedAt may change
- if no replacement is found, the original record is restored
- if another field changes unexpectedly, the whole repair is rolled back

No Supabase SQL changes.
No sync changes.
No Work Brain changes.
Do NOT clear site data.

Promises test:
1. Confirm V4.7.10.6.2 is live.
2. My Library → Promises and Pomegranates → Edit.
3. Click `✨ Find Missing Cover`.
4. Wait for the result message.
5. Then check the library card.
