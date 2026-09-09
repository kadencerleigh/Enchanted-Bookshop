ENCHANTED BOOKSHOP V4.23.5 — EXACT LIBRARY DOM FIX

This patch targets the ACTUAL Library DOM selectors used by V4.11:
- .library-view-panel
- .view-chip
- .library-cover-card
- .library-cover-art
- .library-cover-title
- .library-cover-author

FIXES
- View your collection panel now truly follows the selected atmosphere.
- The real cover frame (.library-cover-art) now follows the selected atmosphere.
- Removes the accidental colored blocks behind book title/author text from V4.23.4.
- Actual book cover images remain untouched.
- Original Enchanted theme intentionally keeps its original styling.
- No data changes.
- No Supabase changes.
- More-menu fix remains intact.
- Do NOT clear site data.

FIRST TEST
1. Deploy V4.23.5.
2. Gothic -> Library.
3. Confirm View your collection is black/red/gold.
4. Confirm cover frames are black/oxblood, not green.
5. Confirm NO red rectangle behind title/author.
6. Cottagecore -> Library and confirm the same structure in sage/cream/natural tones.
