# V4.7.10.5 — Manual Entry Cover Enrichment
Tests our manual-entry-vs-scan hypothesis.

When a book is saved with an ISBN but no cover, the editor performs a cover-only metadata lookup and validates the image before saving it. It does not overwrite confirmed title, author, series, genres, tags, spice, format, page count, notes, or reading data.

Test with a NEW book entered manually on the computer, including its ISBN. Save it and check whether the library card receives a cover.

No Supabase SQL changes. Do not clear site data.
