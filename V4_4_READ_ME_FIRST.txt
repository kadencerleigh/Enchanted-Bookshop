ENCHANTED BOOKSHOP V4.4 — BOOK INTELLIGENCE BRAIN

NO NEW SUPABASE SQL REQUIRED.

NEW / IMPROVED:
• ISBN scans now combine Google Books + Open Library instead of accepting the first incomplete record.
• Missing Open Library authors are resolved from author records when possible.
• A second work-level lookup tries to recover missing author, genres/subjects, cover, and publication information.
• Standardized genre mapping is stronger, including Dark Romance / mafia-romance signals.
• Series name/number can be inferred when metadata explicitly says “Book X of the Y series.”
• Spice suggestions use richer combined metadata and show confidence. They remain suggestions, because public book metadata does not provide a universal reliable spice rating.
• Existing V4.3 Reading Challenge, Currently Reading, Scan to Add, Series Brain, backups, and Supabase book sync are preserved.

BRUTAL PRINCE TEST:
The upgraded lookup should have a much better chance of recovering Sophie Lark as author and Dark Romance/Romance as genres when those signals are available from the combined metadata. Spice should be suggested only when the retrieved metadata contains useful romance/heat signals.

DEPLOY:
1. Back up your Bookshop JSON first.
2. Replace the GitHub app files with this package and commit to main.
3. Do NOT run the SQL files again.
4. Do NOT clear Local Storage.
5. Update/reload the service worker as before.
