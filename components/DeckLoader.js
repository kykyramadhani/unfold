"use client";

import { motion } from "framer-motion";

import { DeckCharacter } from "@/components/CardCharacters";

/**
 * Shown while the gameplay route is still loading. It borrows the deck's own
 * color and character so the wait looks like part of the deck rather than a
 * generic spinner. Falls back to neutral styling if the deck is unknown.
 */
export default function DeckLoader({ deck }) {
  const surface = deck?.theme?.surface ?? "bg-surface";
  const dot = deck?.theme?.stackBack ?? "bg-muted";

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-10 px-6">
      <motion.div
        className={`flex size-32 items-center justify-center rounded-3xl ${surface} shadow-lg shadow-black/20 sm:size-36`}
        animate={{ y: [0, -26, 0], rotate: [-5, 5, -5], scale: [1, 1.04, 1] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
      >
        <DeckCharacter theme={deck?.theme} className="size-20 sm:size-24" />
      </motion.div>

      <div className="flex gap-2" role="status" aria-label="Loading">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className={`size-2.5 rounded-full ${dot}`}
            animate={{ y: [0, -7, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}
