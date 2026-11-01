"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import DeckLoader from "@/components/DeckLoader";
import DeckTile from "@/components/DeckTile";
import SiteHeader from "@/components/SiteHeader";
import { decks } from "@/data/decks";
import { useI18n } from "@/lib/i18n";

export default function DecksPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [opening, setOpening] = useState(null);

  // The router stays on this page until the next route is ready, so without
  // this the tap feels dead for as long as that takes. Show the deck's own
  // loader right away instead.
  function open(deck) {
    setOpening(deck);
    startTransition(() => router.push(`/play/${deck.id}`));
  }

  const cardCount = decks.reduce((sum, d) => sum + d.cards.en.length, 0);

  return (
    <>
      <SiteHeader mobileAction="close" />
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-6 pb-12 lg:px-[73px]">
        <div className="lg:px-8">
          <header className="pt-9 lg:pt-16">
            <p className="text-[10px] leading-[15px] font-bold tracking-[1.2px] text-ink lg:text-xs lg:leading-[18px]">
              <span className="lg:hidden">{t("decksEyebrowMobile")}</span>
              <span className="hidden lg:inline">{t("decksEyebrowDesktop")}</span>
            </p>
            <h1 className="mt-5 font-display text-[43px] leading-[51px] font-semibold text-ink lg:mt-6 lg:text-[72px] lg:leading-[89px]">
              {t("decksTitle")}
            </h1>
            <p className="mt-5 max-w-[970px] text-base leading-[25px] text-muted lg:text-[19px] lg:leading-[30px]">
              <span className="lg:hidden">{t("decksSubtitleMobile")}</span>
              <span className="hidden lg:inline">{t("decksSubtitleDesktop")}</span>
            </p>
          </header>

          <div className="mt-8 hidden items-center justify-between text-xs font-bold tracking-[1.2px] lg:mt-24 lg:flex">
            <span className="text-ink">{t("exploreDecks")}</span>
            <span className="text-muted">{t("decksCount", { decks: decks.length, cards: cardCount })}</span>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-[19px] md:grid-cols-3 md:gap-7 lg:mt-6">
            {decks.map((deck, i) => (
              <DeckTile key={deck.id} deck={deck} index={i} onOpen={open} />
            ))}
          </div>
        </div>

        <AnimatePresence>
          {pending && opening && (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 flex flex-col bg-app"
            >
              <DeckLoader deck={opening} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
