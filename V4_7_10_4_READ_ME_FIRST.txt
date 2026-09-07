# Enchanted Bookshop V4.7.10.4 — Cover Button UI Fix

Surgical patch from V4.7.10.3.

- Forces `✨ Find / Recover Cover` to render for exact-owned books with no saved cover.
- Attaches the click handler whenever the button exists.
- Does not change Work Brain, sync, series logic, local-first duplicate detection, or cover-search logic.
- No Supabase SQL changes.

Test:
1. Confirm `V4.7.10.4 • Cover Button UI Fix`.
2. Scan ISBN `9781464229015`.
3. Confirm BOTH buttons appear:
   - 🧠 Preview Work Intelligence
   - ✨ Find / Recover Cover
4. Do not clear site data.
