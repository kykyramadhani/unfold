"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { CHARACTERS, BlobShocked } from "@/components/CardCharacters";
import { CARDS_PER_ROUND } from "@/lib/hand";
import { useI18n } from "@/lib/i18n";

export default function DeckTile({ deck, index = 0, onOpen }) {
  const { t, tr } = useI18n();
  const Character = CHARACTERS[deck.theme.character] ?? BlobShocked;
  const { theme } = deck;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.99 }}
      className="relative h-full"
    >
      {/* two cards peeking out below so the tile looks like a stack */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-9 top-0 -bottom-5 rounded-3xl ${theme.stackBack} shadow-lg shadow-black/25`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-4.5 top-0 -bottom-2.5 rounded-3xl ${theme.stackFront} shadow-lg shadow-black/25`}
      />
      <Link
        href={`/play/${deck.id}`}
        onClick={(e) => {
          // Let cmd/ctrl/shift clicks open a new tab the normal way.
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
          if (!onOpen) return;
          e.preventDefault();
          onOpen(deck);
        }}
        className={`group relative flex h-full flex-col justify-between rounded-3xl border border-black/5 p-6 shadow-lg shadow-black/20 transition-shadow hover:shadow-black/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/50 ${theme.surface}`}
      >
        <div>
          <Character className="size-20 drop-shadow-md" {...theme.characterColors} />
          <h2 className={`mt-5 text-xl font-semibold tracking-tight ${theme.onSurface}`}>
            {tr(deck.title)}
          </h2>
          <p className={`mt-2 text-sm leading-relaxed ${theme.onSurfaceMuted}`}>
            {tr(deck.description)}
          </p>
        </div>

        <div className={`mt-10 flex items-center justify-between ${theme.onSurfaceMuted}`}>
          <span className="text-xs tracking-widest uppercase">
            {t("levelN", { n: deck.level })} · {t("cardsN", { n: Math.min(CARDS_PER_ROUND, deck.cards.en.length) })}
          </span>
          <ArrowUpRight className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </Link>
    </motion.div>
  );
}
