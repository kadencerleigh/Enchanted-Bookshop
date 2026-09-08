ENCHANTED BOOKSHOP V4.8.2 — COVER RESCUE 2.0

Built from the tested V4.8.1 Collector Rescue checkpoint.

NEW
- If online cover candidates are wrong or missing, choose/take a photo of your own physical cover.
- The photo is resized/compressed before saving.
- A preview + explicit confirmation appears before anything changes.
- Only cover + cover source + updated timestamp change when confirmed.
- Custom cover photos are stored with the book record, so normal JSON backup/cloud book sync can carry them too.
- Existing coverSource is now preserved when the normal Edit Book form is saved.

STARSIDE TEST
1. Library → Starside → Edit Book → Find Missing Cover.
2. Ignore the wrong same-work candidate.
3. Tap “Use My Own Cover”.
4. Choose/take the photo of the actual Deluxe Limited Edition cover.
5. Preview it and tap “Use This Photo”.
6. Return to Library and confirm the physical-copy photo is displayed.

SAFETY
- No Supabase schema/SQL changes.
- No automatic selection of same-work candidates.
- Failed/cancelled photo selection changes nothing.
- Do NOT clear Chrome site data/localStorage to update.
