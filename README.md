# Enchanted Bookshop V4.8.4 — Bookshop Learning Brain

Built from the verified V4.8.3 Unknown ISBN Rescue checkpoint.

## What is new
- Unknown ISBN Rescue can now **remember an ISBN-to-work connection** after you confirm the owned work.
- A new **Remember this ISBN** step is explicit and safe: it saves the association only; it does not invent edition metadata or add a physical copy.
- Future scans check the local Bookshop Learning Brain **before public metadata APIs**, so a taught ISBN is recognized immediately even when Google Books/Open Library fail.
- Remembered ISBNs live inside Work Intelligence, so they are included in the existing JSON backup and existing Supabase Work Intelligence sync.
- **Compare once** remains available if you do not want to teach the Bookshop permanently.
- No new Supabase tables or SQL changes are required.

## Safety
- Existing exact-owned ISBN local lookup remains first.
- Learned ISBN recognition never pretends to know edition-specific format, cover, publisher, printing, or collector features.
- Auto-sync behavior is unchanged.
- V4.8.2 custom cover rescue and V4.8.3 different-edition flow are preserved.

## Recommended Starside test
1. Shopping Scanner → enter `9780063479791`.
2. If public metadata still fails, enter `Starside` / `Alex Aster`.
3. Choose your owned Deluxe Limited Edition.
4. Tap **Remember this ISBN**.
5. Keep browsing / close the result.
6. Scan `9780063479791` again. It should now skip the rescue form and go directly to **DIFFERENT EDITION**, with metadata source shown as the Bookshop Learning Brain.
7. Manual Sync Now on phone, then Pull + merge on computer if you want to verify the learned ISBN travels cross-device.
