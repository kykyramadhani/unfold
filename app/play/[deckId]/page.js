"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import SwipeableCard from "@/components/SwipeableCard";
import { CardFaceDown, CardFaceUp } from "@/components/CardFaces";
import EndScreen from "@/components/EndScreen";
import GestureHint from "@/components/GestureHint";
import { getDeck } from "@/data/decks";
import { drawHand } from "@/lib/hand";
import { useGestureHint } from "@/lib/hints";
import { useI18n } from "@/lib/i18n";

export default function PlayPage() {
  const { deckId } = useParams();
  const { t, tr } = useI18n();
  const deck = getDeck(deckId);
  const poolSize = deck ? deck.cards.en.length : 0;

  const [index, setIndex] = useState(0);
  // Not zero while a card is flying out. This is all the drag release sets, so
  // the exit can start without touching any question data.
  const [exitDirection, setExitDirection] = useState(0);
  // Positions in the deck's pool. Null until the cards are dealt.
  const [hand, setHand] = useState(null);
  // Copy of the card's flip state so the hint can match it.
  const [flipped, setFlipped] = useState(false);
  const { show: showHint, recordSwipe } = useGestureHint();

  const deal = useCallback(() => {
    setHand(drawHand(poolSize));
    setIndex(0);
    setExitDirection(0);
    setFlipped(false);
  }, [poolSize]);

  // Deal after mount, never during render. Math.random() on the server would
  // not match the client and would break hydration.
  useEffect(() => {
    deal();
  }, [deal]);

  if (!deck) notFound();

  // The heavy render, new question and new card, happens here after the old
  // card is gone and before the next one fades in.
  function handleExitComplete() {
    if (!exitDirection) return; // the end screen left, not a card
    setExitDirection(0);
    setIndex((i) => i + 1);
    setFlipped(false); // the next card mounts face down
  }

  const pool = tr(deck.cards);
  const title = tr(deck.title);
  const total = hand?.length ?? 0;
  const finished = hand !== null && index >= total;

  // pt-20 on mobile keeps the header below the fixed settings bar. On wider
  // screens the header is centered and narrow, so it never reaches it.
  return (
    <main className="flex flex-1 flex-col px-5 pt-20 pb-10 sm:px-8 sm:pt-5">
      {/* keep it simple: a progress bar and a close button */}
      <header className="mx-auto flex w-full max-w-sm items-center gap-4">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-ink/10">
          {/* Use scaleX, not width. Animating width forces a layout on
              every frame while the card is moving. */}
          <motion.div
            className="h-full w-full origin-left rounded-full bg-ink"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: total ? Math.min(index, total) / total : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 26 }}
          />
        </div>
        <Link
          href="/decks"
          aria-label={t("leaveDeck")}
          className="text-muted transition-colors hover:text-ink"
        >
          <X className="size-5" />
        </Link>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 py-6">
        <AnimatePresence mode="wait" custom={exitDirection} onExitComplete={handleExitComplete}>
          {finished ? (
            <EndScreen key="end" onRestart={deal} />
          ) : hand && exitDirection === 0 ? (
            <SwipeableCard
              key={index}
              direction={exitDirection}
              onFlip={setFlipped}
              onSwipe={(dir) => {
                setExitDirection(dir);
                recordSwipe();
              }}
              front={<CardFaceDown theme={deck.theme} deckTitle={title} />}
              back={
                <CardFaceUp theme={deck.theme} deckTitle={title} question={pool[hand[index]]} />
              }
            />
          ) : null}
        </AnimatePresence>
        <GestureHint flipped={flipped} show={showHint && hand !== null && !finished} />
      </div>
    </main>
  );
}
