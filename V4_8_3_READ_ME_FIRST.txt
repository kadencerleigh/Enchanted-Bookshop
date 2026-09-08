ENCHANTED BOOKSHOP V4.8.3 — UNKNOWN ISBN RESCUE

Built from V4.8.2 Cover Rescue 2.0.

NEW:
- When ISBN metadata lookup fails, Shopping Mode no longer dead-ends.
- Enter title + author and compare the unknown ISBN against books you already own.
- Choose the matching owned work; the scanned ISBN stays separate.
- Shopping Mode then treats a different ISBN as a different-edition comparison.
- Nothing is added to the Library during rescue unless you explicitly choose Add.
- Manual Add remains available.

SAFETY:
- No Supabase schema/SQL changes.
- V4.8.2 custom-cover rescue preserved.
- Cache-busting/service-worker lifecycle preserved.
- Existing local-first exact ISBN behavior preserved.
