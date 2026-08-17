"use client";

import { motion } from "framer-motion";
import { RotateCcw, LayoutGrid } from "lucide-react";

import Button from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";

export default function EndScreen({ onRestart }) {
  const { t } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 170,
        damping: 26,
        mass: 1,
        opacity: { duration: 0.28, ease: "easeOut" },
      }}
      className="flex w-full max-w-sm flex-col items-center gap-8 text-center"
    >
      <div>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t("endTitle")}</h2>
        <p className="mt-3 text-muted">{t("endSubtitle")}</p>
      </div>

      <div className="flex w-full flex-col gap-3">
        <Button onClick={onRestart}>
          <RotateCcw className="size-4" />
          {t("restartDeck")}
        </Button>
        <Button href="/decks" variant="outline">
          <LayoutGrid className="size-4" />
          {t("playAnother")}
        </Button>
      </div>
    </motion.div>
  );
}
