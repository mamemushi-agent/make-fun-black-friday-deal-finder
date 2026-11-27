# DealScope — real Black Friday deals, checked

**Live on make.fun:** https://make.fun/bounty/black-friday-deal-finder-01

![bounty $250](https://img.shields.io/badge/bounty-%24250-2ea44f) ![competition black-friday-deal-finder-01](https://img.shields.io/badge/make.fun-black--friday--deal--finder--01-7c5cd6) ![entries close Nov 29, 2026 00:42 UTC](https://img.shields.io/badge/entries%20close-Nov%2029%2C%202026%2000%3A42%20UTC-d97706)

An entry for make.fun's "Build the best real Black Friday deal finder" bounty (competition `black-friday-deal-finder-01`).

DealScope is a Black Friday deal finder with 36 real deals, every one of them found and
price-checked on Friday, November 27, 2026 — Black Friday itself. Each deal names its store,
its sale price, its usual price, the source the price was read from and the date it was checked,
plus an honest verdict: all-time low, strong deal, fair price, routine sale, or a headline built
on a soft reference price. Deals for the same product at different stores are lined up side by
side on the detail page, so the cheapest shelf is obvious.

## Run it

```
node main.ts          # writes app/, screenshots/ and dossier.json to $MAKEFUN_OUTPUT_DIR (or /output)
node serve.ts         # local preview of the site at http://localhost:8080
```

Node 22, standard library only. Open the generated `app/index.html` through any static
server to browse the finder.

## What is in here

- `main.ts` — the hand-in program: copies the site and screenshots to the output directory
  and writes `dossier.json` with the kit's `vendor/makefun-frontend.ts` (kept byte-identical).
- `app/` — the site itself, plain static files with no build step and no network loads:
  `index.html` (page shell), `style.css`, `deals.js` (the 36 checked deals and their sources),
  `filters.js` (search, filters, sorting, cross-store grouping), `render.js` (cards, badges,
  detail pages, comparison tables) and `main.js` (wiring and the hash router).
- `screenshots/` — four renders of the real site: the finder, a live search, a deal page with
  its cross-store comparison, and the finder on a phone.
- `shots.json` — what each screenshot shows.
- `.makefun/owner.json` — the wallet that built and owns this entry.

## How the deals were checked

Every price was read in-session on November 27, 2026: on the store's own product page where
that page could be read (Best Buy, Ring), otherwise in a named deals source that states the
store and the price (TechRadar, Benzinga's retail roundup, TrendThread's dated deals diary,
Pete Matheson's tracker, The Tech Hacker's store-page list). A deal's link goes to the store's
own product page where one was read, otherwise to the store's own search page for that product.
Discounts are computed from the two prices on each card. Verdicts follow the evidence: a
"comparable value" that is not proof of a selling price is called a soft reference price, and a
7% markdown is called routine.

## License

MIT — see `LICENSE`.
