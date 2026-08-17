"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MoveHorizontal, PointerIcon } from "lucide-react";

import { useI18n } from "@/lib/i18n";

/**
 * One line under the card that matches what the card needs next. It sits
 * outside the card on purpose. Putting it on the artwork would say the same
 * thing twice and crowd the drawing.
 */
export default function GestureHint({ flipped, show }) {
  const { t } = useI18n();
  const Icon = flipped ? MoveHorizontal : PointerIcon;

  return (
    // Fixed height so the layout does not jump when the hint changes.
    <div className="flex h-6 items-center justify-center" aria-live="polite">
      <AnimatePresence mode="wait">
        {show && (
          <motion.p
            key={flipped ? "swipe" : "tap"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="flex items-center gap-2 text-sm text-muted"
          >
            <motion.span
              aria-hidden
              animate={flipped ? { x: [-3, 3, -3] } : { scale: [1, 0.86, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Icon className="size-4" />
            </motion.span>
            {flipped ? t("hintSwipe") : t("hintTap")}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
