"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "unfold:swipes";

/** How many swipes before we assume the player knows the gesture. */
export const LEARNED_AFTER = 3;

/**
 * Hints hide themselves once the player has swiped a few times. `show` stays
 * false until the count is read from storage, so a returning player never
 * sees a flash of a hint they no longer need.
 */
export function useGestureHint() {
  const [swipes, setSwipes] = useState(null);

  useEffect(() => {
    const stored = Number(localStorage.getItem(STORAGE_KEY));
    setSwipes(Number.isFinite(stored) ? stored : 0);
  }, []);

  const recordSwipe = useCallback(() => {
    setSwipes((current) => {
      const next = (current ?? 0) + 1;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // private mode, so the hints just come back next visit
      }
      return next;
    });
  }, []);

  return { show: swipes !== null && swipes < LEARNED_AFTER, recordSwipe };
}
