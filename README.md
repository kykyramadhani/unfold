# Unfold

A card game for deep talks and ice breakers. Tap a card to reveal the question,
swipe to get the next one.

Built with Next.js (App Router), Tailwind CSS v4, and Framer Motion.

## Features

- Three decks at different depths: Light & Fun, Us Two, Deep Dive
- Each round deals 10 random questions out of a pool of 50
- 3D flip and swipe with spring physics
- Dark and light mode that follows the OS and can be overridden
- English and Indonesian, including every question, switchable mid round

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/                  routes: splash, deck picker, gameplay
components/           SwipeableCard, card faces, characters, shared UI
lib/                  i18n, theme, card dealing, gesture hints
data/decks.js         deck content, swap for a database call later
```

`SwipeableCard` only handles gestures and the flip. The card faces are passed
in as props, so it knows nothing about decks or questions.

## Tests

These drive a real browser with Playwright. Start the dev server first, then:

```bash
node test-swipe.mjs      # swipe brings in the next card, flip, end, restart
node test-hand.mjs       # random draw: size, no repeats, language stays put
node test-settings.mjs   # theme and language switching, saving, no flash
node sens.mjs            # swipe sensitivity table
node perf.mjs            # frame times during the exit animation
```

## Adding a deck

Add an entry to `data/decks.js`. Every deck needs `title`, `description` and
`cards` as `{ en, id }`, plus a `theme` with colors and one of the characters
from `components/CardCharacters.js`.

Both language arrays have to be the same length. The shuffle picks positions
rather than strings, so a card keeps its place when the language changes.
