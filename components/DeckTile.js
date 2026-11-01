"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { useI18n } from "@/lib/i18n";

const LABEL = "text-[10px] leading-[15px] font-bold tracking-[1.2px] md:text-xs md:leading-[18px]";

export default function DeckTile({ deck, index = 0, onOpen }) {
  const { t, tr } = useI18n();
  const { theme } = deck;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.99 }}
      className="h-full"
    >
      <Link
        href={`/play/${deck.id}`}
        onClick={(e) => {
          // Let cmd/ctrl/shift clicks open a new tab the normal way.
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
          if (!onOpen) return;
          e.preventDefault();
          onOpen(deck);
        }}
        className={`group relative flex h-[151px] flex-col overflow-hidden rounded-[18px] p-[18px] text-ink focus:outline-none focus-visible:ring-4 focus-visible:ring-ink/30 md:h-[473px] md:rounded-[27px] md:p-[29px] ${theme.surface}`}
      >
        <p className={LABEL}>{t("deckN", { n: String(index + 1).padStart(2, "0") })}</p>

        {/* the round badge with the deck's symbol */}
        <div className="absolute top-[13px] right-[17px] flex size-[76px] items-center justify-center md:top-[55px] md:right-[31px] md:size-[137px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={theme.circle} alt="" className="absolute inset-0 size-full" />
          <span aria-hidden className="relative text-[34px] leading-none md:text-[61px]">
            {theme.symbol}
          </span>
        </div>

        <div className="mt-auto md:mt-0 md:pt-[148px]">
          <h2 className="font-display text-[29px] leading-[38px] font-semibold md:text-[48px] md:leading-[58px]">
            {tr(deck.title)}
          </h2>
          <p className="mt-2 text-sm font-medium md:mt-1 md:text-xl md:font-bold">{tr(deck.tagline)}</p>
          <p className="mt-5 hidden max-w-[322px] text-base leading-6 md:block">{tr(deck.description)}</p>
        </div>

        <ArrowUpRight aria-hidden strokeWidth={2.5} className="absolute right-[22px] bottom-[18px] size-[18px] md:hidden" />

        <div className="mt-auto hidden border-t border-ink/20 pt-4 md:block">
          <span className={`${LABEL} flex items-center gap-4`}>
            {t("openDeck")}
            <ArrowUpRight aria-hidden strokeWidth={2.5} className="size-3.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
