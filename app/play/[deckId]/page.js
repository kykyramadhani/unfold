"use client";

import { ArrowLeft, ArrowUpRight, RotateCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";

import SwipeableCard from "@/components/SwipeableCard";
import { CardFaceDown, CardFaceUp } from "@/components/CardFaces";
import EndScreen from "@/components/EndScreen";
import GestureHint from "@/components/GestureHint";
import { LangSwitch, Logo } from "@/components/SiteHeader";
import Button from "@/components/ui/Button";
import { getDeck } from "@/data/decks";
import { drawHand } from "@/lib/hand";
import { useGestureHint } from "@/lib/hints";
import { useI18n } from "@/lib/i18n";

const LABEL = "text-[10px] leading-[15px] font-bold tracking-[1.2px] sm:text-xs sm:leading-[18px]";
const pad = (n) => String(n).padStart(2, "0");

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
  const current = Math.min(index + 1, total);

  function swipe(dir) {
    setExitDirection(dir);
    recordSwipe();
  }

  // The Next button throws the card the same way a swipe does.
  const next = () => {
    if (hand && !finished && exitDirection === 0) swipe(1);
  };

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col overflow-x-clip px-6 pb-10 lg:px-[73px]">
      {/* phone header: back, deck name, close */}
      <header className="flex h-[84px] items-center justify-between border-b border-line lg:hidden">
        <Link href="/decks" aria-label={t("leaveDeck")} className="text-ink"><ArrowLeft className="size-6" strokeWidth={2.5} aria-hidden /></Link>
        <span className="text-xs font-bold text-ink uppercase">{title}</span>
        <Link href="/" aria-label={t("close")} className="text-[26px] leading-none text-ink">×</Link>
      </header>

      {/* desktop header */}
      <header className="hidden h-[105px] grid-cols-[1fr_auto_1fr] items-center border-b border-line lg:grid">
        <div className="flex items-center gap-[78px]">
          <Logo />
          <Link href="/decks" className="flex items-center gap-2 text-[15px] font-bold text-text hover:text-ink"><ArrowLeft className="size-4" strokeWidth={2.5} aria-hidden /> {t("allDecks")}</Link>
        </div>
        <span className="text-xs font-bold tracking-[1.2px] whitespace-pre text-muted uppercase">
          {title}  /  {t("cardOf", { n: pad(current), total })}
        </span>
        <LangSwitch className="justify-self-end" />
      </header>

      <div className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-[1fr_475px] lg:gap-[100px] lg:py-12 xl:pl-8">
        {/* editorial column, desktop only */}
        <div className="hidden lg:block">
          <p className={`${LABEL} text-ink`}>{t("takeYourTimeDesktop")}</p>
          <h1 className="mt-14 font-display text-[61px] leading-[76px] font-semibold text-ink">
            {t("playLine1")}
            <br />
            <span className="text-accent">{t("playLine2")}</span>
          </h1>
          <p className="mt-12 max-w-[495px] text-xl leading-[31px] text-muted">{t("playBody")}</p>
          <div className="mt-24 w-[416px] border-t border-line pt-6">
            <p className={`${LABEL} text-muted`}>{t("makeSpace")}</p>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-[342px] flex-col lg:max-w-[475px]">
          <p className={`${LABEL} mb-5 text-ink lg:hidden`}>{t("takeYourTimeMobile")}</p>

          <div className="flex min-h-[482px] items-center justify-center lg:min-h-[599px]">
            <AnimatePresence mode="wait" custom={exitDirection} onExitComplete={handleExitComplete}>
              {finished ? (
                <EndScreen key="end" onRestart={deal} />
              ) : hand && exitDirection === 0 ? (
                <SwipeableCard
                  key={index}
                  direction={exitDirection}
                  onFlip={setFlipped}
                  onSwipe={swipe}
                  front={<CardFaceDown theme={deck.theme} deckTitle={title} />}
                  back={
                    <CardFaceUp
                      theme={deck.theme}
                      deckTitle={title.toUpperCase()}
                      question={pool[hand[index]]}
                      n={current}
                      total={total}
                    />
                  }
                />
              ) : null}
            </AnimatePresence>
          </div>

          {/* phone: progress and swipe hint under the card */}
          <div className="mt-5 flex items-center justify-between text-muted lg:hidden">
            <span className="text-sm font-bold whitespace-pre">{pad(current)}  /  {total}</span>
            <span className="text-[13px] font-medium">{t("swipeMore")}</span>
          </div>

          <div className="mt-4 hidden lg:block">
            <GestureHint flipped={flipped} show={showHint && hand !== null && !finished} />
          </div>

          {!finished && (
            <div className="mt-6 flex flex-col items-center gap-4 lg:mt-4 lg:flex-row lg:gap-[18px]">
              <Button onClick={next} className="h-14 w-full lg:h-[62px] lg:w-[292px]">
                {t("nextQuestion")} <ArrowUpRight className="size-4" strokeWidth={2.5} aria-hidden />
              </Button>
              <Button
                variant="outline"
                onClick={deal}
                className="max-lg:h-auto max-lg:border-0 max-lg:bg-transparent max-lg:p-0 max-lg:text-sm lg:h-[62px] lg:w-[164px]"
              >
                <span className="lg:hidden">{t("shuffleCard")}</span>
                <span className="hidden lg:inline">{t("shuffle")}</span>
                <RotateCw className="size-4" strokeWidth={2.5} aria-hidden />
              </Button>
            </div>
          )}
        </div>
      </div>

      <p className={`${LABEL} hidden text-muted lg:block xl:pl-8`}>{t("tellStories")}</p>
    </main>
  );
}
