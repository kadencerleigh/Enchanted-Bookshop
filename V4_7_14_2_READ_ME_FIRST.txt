# Enchanted Bookshop V4.7.14.2 — Mobile Polish

Built directly from the proven V4.7.14.1 Mobile UI Hotfix checkpoint.

## Fixes
- Hides the gray horizontal scrollbar tracks under Browse genre/filter chips.
- Keeps horizontal swipe/scroll behavior for those chips.
- Mobile bottom-nav view changes now return the page to the top.
- More-menu destinations also return the page to the top.
- Prevents Browse from opening partway down the page beneath the sticky search bar.

## Preserved
- Home / Library / Browse / Scanner / More mobile navigation.
- Existing Shopping Scanner logic.
- Browse + Magical Physical Stacks.
- Books, Series Brain, Work Intelligence, Supabase sync.
- Desktop layout.

## No SQL changes
No database or sync schema changes.

## First test
1. Update phone to V4.7.14.2.
2. From Home, scroll down.
3. Tap Browse.
4. Confirm Browse starts at the top.
5. Confirm gray scrollbar tracks are gone while genre/filter chips still swipe sideways.
6. Then test the bottom Scanner button.
