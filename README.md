# Enchanted Bookshop V3 — Sync-ready PWA

V3 is the first build intended to be hosted and installed on your Pixel/Windows as a Progressive Web App.

## Included
- Installable PWA manifest + service worker
- Offline caching for the app shell
- Mobile-first interface
- Shopping scanner with camera support when the browser exposes BarcodeDetector
- Manual ISBN fallback
- Google Books + Open Library metadata lookup
- Exact ISBN duplicate detection
- Same-title/different-edition warning
- Local-first library
- Reading status, rating, favorite, spice, edition details
- Backup / restore JSON
- Optional phone ↔ Windows sync through your own Supabase project
- Last-write-wins merge using `updatedAt`
- Synced soft deletions
- Optional auto-sync after edits

## Important: opening it locally
You can inspect the files locally, but install/camera/service-worker behavior requires HTTPS (or localhost). Deploy the whole folder to GitHub Pages, Cloudflare Pages, or another HTTPS static host.

## GitHub Pages deployment
1. Create a new GitHub repository, for example `enchanted-bookshop`.
2. Upload every file in this folder to the repository root.
3. In the repository: Settings → Pages.
4. Under Build and deployment, choose "Deploy from a branch".
5. Choose `main` and `/ (root)`, then Save.
6. Open the generated HTTPS site on your Pixel in Chrome.
7. Use the browser menu or the in-app Install button to install Enchanted Bookshop.

## Sync setup
Sync is optional. The app remains useful without it.

1. Create a Supabase project.
2. Open the project's SQL Editor.
3. Paste and run `SUPABASE_SETUP.sql`.
4. Find your Project URL and anon/publishable key in the Supabase project settings.
5. In Enchanted Bookshop → Sync, paste those two values and save.
6. Create a sync account with your email/password, or sign in.
7. Tap "Sync now".
8. Set up the same hosted app on your other device and sign in with the same account.

The anon/publishable key is designed to be used by browser clients. Row Level Security in the included SQL keeps each signed-in user's rows private.

## Current sync behavior
This is a practical V3 sync foundation, not a Google-Docs-style realtime collaboration system. It merges by book ID and keeps the copy with the newest `updatedAt`. Deletions are soft-deleted so they can propagate to other devices.

## Next upgrades
- richer series gap intelligence
- collector-edition confidence scoring
- improved scanner fallback for browsers without BarcodeDetector
- customizable dashboard widgets
- richer shelves/piles/themes
- optional realtime sync
