# Project status — pick up here

_Last updated: 13 Oct 2026_

## Done
- **Phase 1–3** Discovery, creative proposal, technical plan (approved 12 Oct). Proposal doc: https://claude.ai/code/artifact/c0d8c455-8866-48fd-9fd4-a457cfd4c074
- **Phase 4** Homepage (`/`): Day-to-Night flow, traced POLOS wordmark, "Today at POLOS" live status, Happy Hour, events, visit, closing CTA.
- **Phase 5** Native HTML menus: `/menu`, `/menu/food`, `/menu/drinks`, `/happy-hour`, `/menu/brunch`, `/menu/gluten-free`, `/menu/kids`.
- QA: axe accessibility scan clean (desktop + mobile); Lighthouse mobile 97 perf / 100 a11y.

## Owner decisions (12 Oct 2026)
- Hero line: "Sherwood Park's place to meet up."
- Retire the AI chat assistant. Menus are HTML only — no PDF downloads.
- Apothic Blend is a **red** (removed from White Wine). Printed drinks v7 still lists it under White — fix on next print.
- Gluten-free bun: **no charge**. Printed food menu v8 still says "gluten-free bun 2" — fix on next print.
- Happy Hour times confirmed: Mon–Fri 2–5 PM & 9 PM–Close, Sunday all day. Lounge and patio, dine-in only.

- 13 Oct: Sherwood Park story removed from the website (owner).

## Open items
- [ ] Link Netlify project **polos-oct2026-preview** to this repo (Netlify → Project configuration → Build & deploy → Link repository). Never set `PUBLIC_DEPLOY_ENV` there.
- [ ] Confirm regular hours (Sun–Thu 11–10, Fri–Sat 11–11 are from the old site).
- [ ] Confirm Live Music Tuesdays still runs (hidden until confirmed: `business.json → liveMusic.show`).
- [ ] Confirm photo ↔ dish pairings on the homepage: Steak Salad, Seafood Linguine, Salmon & Prawn Chardonnay.
- [ ] Full-resolution photos / half-day shoot (exterior, room day + night, bar, guests, banquet room, brunch). Current Drive photos are ~500×656 px.
- [ ] Event enquiries: keep Toast lead form or use own form (Netlify form `banquet-enquiry` exists on the old project)? Which email receives them?
- [ ] Private events facts: current packages/prices, room capacity.
- [ ] Google Search Console access (legacy URL check before launch).
- [ ] Make the GitHub repo private.

## Next: Phase 6
Private Events, Gallery (`/gallery` must keep its exact URL), About, Contact, Polos Play at `/play` (source: `~/Sites/polos-play` on the owner's Mac), sitemap.xml + robots.txt, then Phase 7 QA and Phase 8 staging.

## How changes reach GitHub
The cloud workspace cannot push directly. Work is bundled (`git bundle`), copied to `~/Sites/Claude outputs/` on the owner's Mac, and pushed from there after the owner approves a one-time GitHub device sign-in.
