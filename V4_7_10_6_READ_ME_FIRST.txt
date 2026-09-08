# Enchanted Bookshop V4.7.10.6 — Missing Cover Repair

Built from the successful V4.7.10.5 manual-entry cover enrichment checkpoint.

## New feature
Existing cataloged books that have:
- an ISBN, and
- no saved cover

get an `✨ Find Missing Cover` button inside the Edit Book screen.

The button reuses the same cover-only ISBN enrichment pathway that successfully gave
Something Like Home a cover in V4.7.10.5.

## Safety
Cover repair is allowed to update only:
- cover
- coverSource
- updatedAt

If any other book field changes unexpectedly, the repair is rolled back.

It does NOT intentionally overwrite:
- title / author
- series / series number
- genres / tags
- spice
- format / ISBN / page count
- notes
- reading status / ratings
- Work Brain data

No Supabase SQL changes.

## Promises & Pomegranates test
1. Confirm `V4.7.10.6 • Missing Cover Repair` is live.
2. Go to My Library.
3. Open the existing Promises and Pomegranates record.
4. Choose Edit.
5. Confirm `✨ Find Missing Cover` appears.
6. Click it.
7. If a valid ISBN cover is found, it is saved directly to the existing record.
8. Return to My Library and verify the cover.
9. Reopen the record and confirm all other metadata is unchanged.

Do NOT delete/re-add Promises.
Do NOT clear site data.
