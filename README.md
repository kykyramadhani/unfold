# Unfold

A card game for deep talks and ice breakers. Pick a deck, tap a card to reveal
the question, swipe it away to draw the next one.

Built with Next.js (App Router), Tailwind CSS v4, and Framer Motion. All data is
hardcoded for now.

## Features

- Three decks at different depths: Light & Fun, Us Two, Deep Dive
- Each round deals 10 random questions out of a pool of 50 per deck
- 3D card flip and a swipe that reacts to both distance and speed
- Dark and light mode that follows the OS and can be overridden
- English and Indonesian, including every question, switchable mid round
- Gesture hints that stop showing once you have swiped a few times

## Getting started

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
  layout.js             providers, fonts, the theme script, settings bar
  template.js           fade between routes
  page.js               splash screen with the fanned deck hero
  decks/page.js         deck picker, owns the loading overlay
  play/[deckId]/page.js gameplay: deals a hand and tracks progress
  globals.css           color tokens for light and dark mode
  icon.png              favicon, plus favicon.ico and apple-icon.png

components/
  SwipeableCard.js      flip and swipe gestures only
  CardFaces.js          the cover side and the question side
  CardCharacters.js     the flat vector characters
  DeckTile.js           one deck on the picker, drawn as a stack
  DeckLoader.js         bouncing character shown while a deck opens
  GestureHint.js        the "tap to reveal" / "swipe" line
  EndScreen.js          end of round
  ui/Button.js          the one pill button used everywhere

lib/
  i18n.js               language state, UI strings, the t() and tr() helpers
  theme.js              dark/light state and the no flash script
  hand.js               dealing a random hand
  hints.js              tracking whether the player still needs hints

data/decks.js           all deck content
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

**Theme is set before the first paint.** `lib/theme.js` exports a small script
that layout.js inlines into `<head>`. It reads the saved choice, falls back to
the OS setting, and adds the `dark` class before React runs, so the page never
flashes the wrong mode.

**Colors are split in two.** App colors (background, text, borders) are CSS
variables in `globals.css` and flip between modes. Deck colors live in
`data/decks.js` and stay the same in both, because they are the deck's identity.

**The loading overlay lives on the deck picker**, not on the play route. The
router stays on the current page until the next one is ready, so a `loading.js`
file never gets a chance to render here. `useTransition` tells us the navigation
is still pending, and the overlay shows that deck's own color and character.

## Tests

These drive a real browser with Playwright. Start the dev server first, then run
whichever you need:

```bash
node test-swipe.mjs      # swipe brings in the next card, flip, end, restart
node test-hand.mjs       # random draw: size, no repeats, language stays put
node test-settings.mjs   # theme and language switching, saving, no flash
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
  description: { en: "...", id: "..." },
  theme: {
    surface: "bg-[#RRGGBB]",    // card and tile color
    stackFront: "bg-[#...]",    // the two cards peeking out under the tile
    stackBack: "bg-[#...]",
    onSurface: "text-white",    // text color that reads on `surface`
    onSurfaceMuted: "text-white/75",
    tape: "bg-[#...]",          // the tape label on the question side
    character: "hug",           // blob | hug | squiggle | burst
    characterColors: { body: "#...", shade: "#...", ink: "#..." },
  },
  cards: { en: [...], id: [...] },
}
```

Both language arrays have to be the same length and in the same order, since the
shuffle works on positions. A deck can hold any number of questions; only
`CARDS_PER_ROUND` from `lib/hand.js` are dealt per round.

## Adding a character

Characters live in `components/CardCharacters.js` on a 200x200 canvas. Each one
takes `body`, `shade` and `ink` colors so the same shape can be reused by
different decks. Add it to the `CHARACTERS` map at the bottom of the file, then
reference the key from a deck's `theme.character`.
