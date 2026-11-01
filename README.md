# Unfold

A card game for deep talks and ice breakers. Pick a deck, tap a card to reveal
the question, swipe it away to draw the next one.

Built with Next.js 16 (App Router), React 19, Tailwind CSS v4, Framer Motion and
Lucide icons. All data is hardcoded for now.

## Features

- Three decks at different depths: Break the ice, A little deeper, Heart to heart
- Each round deals 10 random questions out of a pool of 50 per deck
- 3D card flip and a swipe that reacts to both distance and speed
- Warm paper look from the Figma designs, with Fraunces and DM Sans fonts
- Layouts made for both desktop and mobile
- English and Indonesian, including every question, switchable mid round
- Gesture hints that stop showing once you have swiped a few times

## Tech stack

| | |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Icons | lucide-react |
| Tests | Playwright scripts (Node) |

## Getting started

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

The first click into a deck is slower in dev because Next compiles the route on
demand. Run `npm run build && npm start` to see real speed.

## Project structure

```
app/
  layout.js             fonts, metadata, the language provider
  template.js           fade between routes
  page.js               splash screen with the fanned deck hero
  decks/page.js         deck picker, owns the loading overlay
  play/[deckId]/page.js gameplay: deals a hand and tracks progress
  globals.css           color tokens (warm paper palette) and fonts
  icon.png              favicon, plus favicon.ico and apple-icon.png

components/
  SwipeableCard.js      flip and swipe gestures only
  CardFaces.js          the cover side and the question side
  HeroCards.js          the fanned stack of cards on the home page
  SiteHeader.js         logo, nav links and the EN / ID switch
  DeckTile.js           one deck on the picker
  DeckLoader.js         bouncing deck symbol shown while a deck opens
  GestureHint.js        the "tap to reveal" / "swipe" line
  EndScreen.js          end of round
  ui/Button.js          the one pill button used everywhere

lib/
  i18n.js               language state, UI strings, the t() and tr() helpers
  hand.js               dealing a random hand
  hints.js              tracking whether the player still needs hints

data/decks.js           all deck content
public/figma/           SVG ornaments, circles and avatars exported from Figma
```

## How a few things work

**The card knows nothing about decks.** `SwipeableCard` takes `front` and `back`
as nodes and only handles the gesture. It reports a swipe direction and stops.
The play page then removes the card, `AnimatePresence` plays the exit, and only
after that does the next question load. That keeps the heavy render out of the
animation.

**Swiping looks at where the card would land**, not where you let go. It adds a
short look ahead of the card's speed to the drag distance, so a slow drag needs
more distance and a quick flick needs almost none. The threshold scales with the
card width so it feels the same on a phone and a desktop.

**The shuffle picks positions, not strings.** `drawHand` returns indices into the
pool, and the active language is applied on top. That way switching between EN
and ID mid round translates the cards you already have instead of dealing a new
set.

**Language is read after mount.** The server always renders English, then
`LocaleProvider` picks up the saved choice from `localStorage`. That keeps the
server and client render identical, so React never warns about hydration.

**Colors are split in two.** App colors (paper, ink, text, lines) are Tailwind
theme tokens in `globals.css`. Deck colors live in `data/decks.js`, because they
are the deck's identity.

**The loading overlay lives on the deck picker**, not on the play route. The
router stays on the current page until the next one is ready, so a `loading.js`
file never gets a chance to render here. `useTransition` tells us the navigation
is still pending, and the overlay shows that deck's own color and symbol.

## Tests

These drive a real browser with Playwright. Start the dev server first, then run
whichever you need:

```bash
node test-swipe.mjs      # swipe brings in the next card, flip, end, restart
node test-hand.mjs       # random draw: size, no repeats, language stays put
node test-loader.mjs     # tapping a deck shows its loader right away
node sens.mjs            # swipe sensitivity: what does and does not dismiss
node perf.mjs            # frame times during the exit animation
```

`sens.mjs` and `perf.mjs` are tuning tools rather than pass/fail tests. `perf.mjs`
takes an optional URL and CPU slowdown factor, for example
`node perf.mjs http://localhost:3000/play/deep-dive 4`.

## Adding a deck

Add an entry to `data/decks.js`:

```js
{
  id: "your-deck",              // used in the URL
  level: 4,
  title: { en: "...", id: "..." },
  tagline: { en: "...", id: "..." },
  description: { en: "...", id: "..." },
  theme: {
    surface: "bg-[#RRGGBB]",    // card, tile and loader color
    rule: "#RRGGBB",            // the divider lines on the question side
    symbol: "✺",                // shown on the cover, tile badge and loader
    circle: "/figma/circle-1.svg", // the round badge behind the symbol
  },
  cards: { en: [...], id: [...] },
}
```

Both language arrays have to be the same length and in the same order, since the
shuffle works on positions. A deck can hold any number of questions; only
`CARDS_PER_ROUND` from `lib/hand.js` are dealt per round.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | dev server on port 3000 |
| `npm run build` | production build |
| `npm start` | serve the production build |
| `npm run lint` | ESLint |

## Author

Rizky Insania Ramadhani ([@kykyramadhani](https://github.com/kykyramadhani))
