"use client";

import { memo } from "react";

import { useI18n } from "@/lib/i18n";

const shell = "flex h-full w-full flex-col overflow-hidden rounded-[25px] sm:rounded-[29px]";
const LABEL = "text-[10px] leading-[15px] font-bold tracking-[1.2px] text-ink uppercase sm:text-xs sm:leading-[18px]";

// Long questions step down a size so they always fit the card.
function questionSize(text) {
  if (text.length <= 60) return "text-[35px] leading-[43px] sm:text-[48px] sm:leading-[61px]";
  if (text.length <= 100) return "text-[28px] leading-[35px] sm:text-[36px] sm:leading-[46px]";
  return "text-[23px] leading-[30px] sm:text-[29px] sm:leading-[38px]";
}

/** Cover side: the deck's color, its symbol and its name. */
function CardFaceDownImpl({ theme, deckTitle }) {
  const { t } = useI18n();
  return (
    <div className={`${shell} ${theme.surface} p-7 sm:p-9`}>
      <span className={LABEL}>unfold</span>
      <div className="flex flex-1 items-center justify-center text-[120px] leading-none text-ink sm:text-[150px]" aria-hidden>
        {theme.symbol}
      </div>
      <p className="font-display text-[29px] leading-[38px] font-semibold text-ink sm:text-[36px] sm:leading-[44px]">
        {deckTitle}
      </p>
      <p className={`${LABEL} mt-3 opacity-70`}>{t("tapToReveal")}</p>
    </div>
  );
}

/** Question side, laid out like the playing card in the design. */
function CardFaceUpImpl({ theme, deckTitle, question, n, total }) {
  const { t } = useI18n();
  const rule = { borderColor: theme.rule };
  return (
    <div className={`${shell} ${theme.surface} px-7 py-7 sm:px-[37px] sm:py-[37px]`}>
      <p className={LABEL}>UNFOLD / {deckTitle}</p>
      <div className="mt-4 border-t sm:mt-5" style={rule} />

      <div className="flex flex-1 flex-col justify-center gap-6 py-4 sm:gap-8">
        <span className="text-[61px] leading-none text-ink sm:text-[66px]" aria-hidden>
          {theme.symbol}
        </span>
        <p className={`font-display font-semibold text-ink ${questionSize(question)}`}>{question}</p>
      </div>

      <div className="border-t pt-5 sm:pt-6" style={rule}>
        <div className="flex items-center justify-between">
          <span className={LABEL}>{t("noRightWrong")}</span>
          <span className={`${LABEL} hidden sm:inline`}>
            {String(n).padStart(2, "0")} / {total}
          </span>
        </div>
      </div>
    </div>
  );
}

// The re-render during a swipe slows down the exit animation. `theme` is a
// stable object from the data file, so the cover side can skip re-rendering.
export const CardFaceDown = memo(CardFaceDownImpl);
export const CardFaceUp = memo(CardFaceUpImpl);
