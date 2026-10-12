# POLOS Social Lounge — website (2026 rebuild)

New website for Polos Social Lounge, Sherwood Park. Built with [Astro](https://astro.build) as a static site.
**This repository does not touch the live site.** poloslounge.com stays on its existing Netlify project until the owner approves the switch.

## Status
- Phase 4 — homepage prototype ✅
- Phase 5 — native menu pages (Food, Drinks, Happy Hour, Brunch) — next
- Phase 6 — Private Events, Gallery, About, Contact, Polos Play

## Run it
```
npm install
npm run dev       # local preview at http://localhost:4321
npm run build     # validates menu data, then builds to dist/
```

## Where things live
| What | File |
| --- | --- |
| Name, address, phone, hours, Happy Hour times, Toast links, GA4 ID | `src/data/business.json` |
| Food menu | `src/data/menu-food.json` |
| Drink menu (incl. desserts) | `src/data/menu-drinks.json` |
| Weekend brunch | `src/data/menu-brunch.json` |
| Happy Hour items + Sherwood Park story | `src/data/menu-happy-hour.json` |
| Photos | `src/assets/photos/` (replace a file with the same name to swap a photo) |
| Colours, type, spacing | `src/styles/tokens.css` |
| Homepage | `src/pages/index.astro` |
| Redirects, headers, Netlify settings | `netlify.toml` |

## Update a price
Open the menu file, find the item, change `"price"`, save. `npm run build` checks every price and refuses to build if one is missing or malformed.

## Analytics
GA4 `G-9T3EQWCEN8` (the existing property) loads **only** in the Netlify production context. Previews are `noindex` and send no analytics.
Clicks on reserve / order / phone / directions / menu / events / play are tracked through `data-track` attributes.
