import { memo } from "react";
import { CHARACTERS, BlobShocked } from "@/components/CardCharacters";

// Shared card body: rounded corners, thin border, soft shadow.
const shell =
  "flex h-full w-full flex-col overflow-hidden rounded-3xl border border-black/5 shadow-2xl shadow-slate-900/25";

const WORDMARK = "text-[10px] font-bold tracking-[0.4em] uppercase";

// Faint notebook grid. Only about 5% gray so it never fights with the text.
const GRID = {
  backgroundImage:
    "linear-gradient(#0000000d 1px, transparent 1px), linear-gradient(90deg, #0000000d 1px, transparent 1px)",
  backgroundSize: "28px 28px",
};

/** Cover side: bright color and one big character in the middle. */
function CardFaceDownImpl({ theme, deckTitle }) {
  const Character = CHARACTERS[theme.character] ?? BlobShocked;
  return (
    <div className={`${shell} ${theme.surface} items-center p-6`}>
      <span className={`${WORDMARK} pt-2 text-white/70`}>unfold</span>
      {/* w-full is needed here. The wrapper is a column flex with
          items-center, which would shrink this row and break the percent
          width below. */}
      <div className="flex w-full flex-1 items-center justify-center">
        <Character className="h-auto w-[88%] max-w-72 drop-shadow-xl" {...theme.characterColors} />
      </div>
      <span className="rounded-full bg-white/25 px-5 py-2 text-sm font-semibold tracking-wide text-white backdrop-blur-sm">
        {deckTitle}
      </span>
    </div>
  );
}

/** Question side: off-white grid paper, a taped label, and the question. */
function CardFaceUpImpl({ theme, deckTitle, question }) {
  return (
    <div className={`${shell} relative bg-[#FAFAF7]`}>
      <div className="absolute inset-0" style={GRID} aria-hidden />
      <div className="relative flex h-full w-full flex-col items-center p-10 text-center">
        {/* tape strip, stuck on a little crooked */}
        <span
          className={`-rotate-2 ${theme.tape} px-4 py-1 text-xs font-bold tracking-[0.2em] text-white uppercase shadow-sm`}
          style={{ clipPath: "polygon(2% 0, 99% 4%, 98% 96%, 1% 100%)" }}
        >
          {deckTitle}
        </span>
        <p className="flex flex-1 items-center justify-center text-2xl leading-relaxed font-medium text-balance text-gray-800 sm:text-3xl">
          {question}
        </p>
        <span className={`${WORDMARK} text-gray-300`}>unfold</span>
      </div>
    </div>
  );
}

// The re-render during a swipe slows down the exit animation. `theme` is a
// stable object from the data file, so the cover side can skip re-rendering.
export const CardFaceDown = memo(CardFaceDownImpl);
export const CardFaceUp = memo(CardFaceUpImpl);
