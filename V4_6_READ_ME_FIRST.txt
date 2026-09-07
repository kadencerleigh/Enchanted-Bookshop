ENCHANTED BOOKSHOP V4.6 — DEEP ENRICHMENT

WHAT CHANGED
- ISBN lookup still protects exact-edition facts.
- Book Intelligence now performs a second, work-level search by title + author.
- It scores candidate work records instead of blindly accepting the first result.
- It combines richer descriptions/categories from Google Books and Open Library.
- Series inference recognizes more natural phrases such as “first book in the ... series.”
- Trope detection can use richer work descriptions (including Hades & Persephone, mafia, forced marriage/proximity, age-gap signals).
- Conservative genre mapping remains: the app should not turn mythology inspiration into Fantasy automatically.
- Existing Brutal Prince curated benchmark remains supported.

NO NEW SUPABASE SQL IS REQUIRED.
DO NOT CLEAR LOCAL STORAGE.

DEPLOY
Replace the files in the GitHub Pages repository root with this build. After GitHub Pages finishes deploying, refresh/update the service worker as usual.

TEST BENCHMARK
Scan Promises and Pomegranates ISBN 9781464229015 again. The purpose of V4.6 is to see whether general work-level enrichment can recover richer genre/trope/series information without adding that title to BOOK_KNOWLEDGE.
