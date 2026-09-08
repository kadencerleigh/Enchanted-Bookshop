# Enchanted Bookshop V4.7.14.1 — Mobile UI Hotfix

Built from stable V4.7.13.1, not the broken V4.7.14.

Fix:
- Targets the app's real shell classes: `.side`, `.main`, `.top`, and `#content`.
- Removes the old left icon rail on screens <= 820px.
- Adds the requested bottom navigation:
  Home / Library / Browse / Scanner / More
- More contains Series, Want to Own, TBR, Favorites, Backup, Sync.
- Reuses the existing native `data-view` navigation system instead of creating a second view system.
- Scanner button forwards to the proven existing Shopping Scanner button.
- Desktop remains unchanged.
- No SQL/data/sync/Work Brain changes.

First test: phone Chrome only. Confirm version, then verify the left rail is gone and bottom nav is visible.
