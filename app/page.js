"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import Button from "@/components/ui/Button";
import { CHARACTERS, BlobShocked } from "@/components/CardCharacters";
import { decks } from "@/data/decks";
import { useI18n } from "@/lib/i18n";

// Fan the real decks out like a hand of cards, same colors and characters.
const FAN = [
  { rotate: -17, y: 22, x: -14 },
  { rotate: 0, y: 0, x: 0 },
  { rotate: 17, y: 22, x: 14 },
];

export default function SplashPage() {
  const { t } = useI18n();

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-12 text-center">
      {/* background glows, one per deck color */}
      <Glow className="top-[12%] left-[6%] size-72 bg-[#FFC93C] sm:size-96" duration={13} />
      <Glow className="top-[42%] right-[4%] size-72 bg-[#FF6B81] sm:size-96" duration={16} delay={1.5} />
      <Glow className="bottom-[6%] left-[28%] size-80 bg-[#6C5CE7] sm:size-104" duration={19} delay={3} />

      {/* the three decks, swaying slowly */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="relative"
      >
        <motion.div
          className="flex justify-center"
          animate={{ y: [0, -9, 0], rotate: [-1.2, 1.2, -1.2] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          {decks.slice(0, 3).map((deck, i) => {
            const Character = CHARACTERS[deck.theme.character] ?? BlobShocked;
            return (
              <motion.div
                key={deck.id}
                initial={{ rotate: 0, x: 0, y: 40, opacity: 0 }}
                animate={{ rotate: FAN[i].rotate, x: FAN[i].x, y: FAN[i].y, opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.1, type: "spring", stiffness: 150, damping: 20 }}
                className={`-mx-2.5 flex h-40 w-28 items-center justify-center rounded-2xl border border-black/10 shadow-xl shadow-black/30 sm:h-48 sm:w-34 ${deck.theme.surface} ${i === 1 ? "z-10" : ""}`}
              >
                <Character
                  className="size-16 drop-shadow-md sm:size-20"
                  {...deck.theme.characterColors}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.35, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        className="relative mt-14"
      >
        <h1 className="text-6xl font-semibold tracking-tight sm:text-8xl">
          Unfold<span className="text-brand">.</span>
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mx-auto mt-5 max-w-sm text-balance text-muted sm:text-lg"
        >
          {t("tagline")}
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, type: "spring", stiffness: 170, damping: 22 }}
        className="relative mt-10"
      >
        <Button href="/decks" size="lg">
          {t("startCta")}
          <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </motion.div>
    </main>
  );
}

function Glow({ className, duration, delay = 0 }) {
  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute rounded-full opacity-25 blur-[110px] ${className}`}
      animate={{ scale: [1, 1.18, 1], opacity: [0.2, 0.32, 0.2] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
