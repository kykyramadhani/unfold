/** How many cards one round deals out of the deck's pool. */
export const CARDS_PER_ROUND = 10;

/**
 * Picks `count` different positions out of a pool of `poolSize`.
 *
 * It returns positions, not questions. The same hand then maps onto whichever
 * language is active, so switching between EN and ID mid round translates the
 * cards you already have instead of dealing a new set.
 *
 * Uses a Fisher-Yates shuffle so every hand is equally likely. Picking at
 * random and retrying on duplicates would be shorter but gets slow once
 * `count` is close to `poolSize`.
 */
export function drawHand(poolSize, count = CARDS_PER_ROUND) {
  const indices = Array.from({ length: poolSize }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.slice(0, Math.min(count, poolSize));
}
