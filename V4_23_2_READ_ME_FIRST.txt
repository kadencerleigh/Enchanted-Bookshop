ENCHANTED BOOKSHOP V4.23.2 — MOBILE MORE ROOT-CAUSE FIX

ROOT CAUSE FOUND:
V4.23's new atmosphere CSS contained:
  .shell,.mobile-more,.modal{position:relative;z-index:1}

Because this rule appeared AFTER the existing mobile CSS, it overrode the More
sheet's position:fixed behavior. The button could remove the hidden class, but
the sheet was no longer behaving as the full-screen mobile overlay.

FIX:
- Removed .mobile-more from the atmosphere-layer position rule.
- Added a final defensive @media(max-width:820px) rule forcing the More sheet
  back to position:fixed with the correct z-index.
- Kept the direct HTML open/close fallback from V4.23.1.
- No data changes.
- No Supabase changes.
- Do NOT clear site data.

FIRST TEST:
Tap More. It should open the bottom sheet.
