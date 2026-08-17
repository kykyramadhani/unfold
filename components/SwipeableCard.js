"use client";

import { useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

import { useI18n } from "@/lib/i18n";

// We check where the card would land, not where the finger let go. That is
// the drag distance plus a bit of its speed. A slow drag needs more distance,
// a quick flick needs almost none. The limit scales with the card width so a
// swipe feels the same on a phone and on a desktop.
const SWIPE_RATIO = 0.18; // of card width
const SWIPE_MIN = 45;
const SWIPE_MAX = 110;
const MOMENTUM_LOOKAHEAD = 0.15; // seconds of velocity to project forward

// Soft and smooth. Damped enough that nothing bounces or wobbles.
const SPRING = { type: "spring", stiffness: 170, damping: 26, mass: 1 };

const offscreen = () => (typeof window === "undefined" ? 800 : window.innerWidth) + 200;

const variants = {
  enter: { y: 24, scale: 0.96, opacity: 0 },
  center: {
    y: 0,
    scale: 1,
    opacity: 1,
    // Spring the position but tween the fade. A spring on opacity settles too
    // slowly and looks sluggish.
    transition: { ...SPRING, opacity: { duration: 0.3, ease: "easeOut" } },
  },
  // The direction comes from the custom prop on AnimatePresence, read at the
  // moment this card is removed.
  exit: (direction) => ({
    x: direction * offscreen(),
    opacity: 0,
    // easeOut, not easeIn. A thrown card leaves fast and then slows down.
    transition: { duration: 0.24, ease: "easeOut", opacity: { duration: 0.2, delay: 0.06 } },
  }),
};

/**
 * Handles tap to flip and drag to dismiss. It knows nothing about decks or
 * questions, since `front` and `back` are just nodes passed in.
 *
 * onDragEnd does no data work. It either springs the card back or reports a
 * direction and stops. The parent then removes this card, AnimatePresence
 * plays the exit, and only after that does the next question load. The parent
 * keys the card by index so each one mounts fresh, which is also why `flipped`
 * needs no manual reset.
 */
export default function SwipeableCard({
  front,
  back,
  direction = 0,
  onSwipe,
  onFlip,
  disabled = false,
}) {
  const { t } = useI18n();
  const [flipped, setFlipped] = useState(false);

  // Both updates run from an event handler, so reading `flipped` here is safe.
  // Keep onFlip outside the updater. React needs updaters to be pure and may
  // run them twice.
  const flip = () => {
    const next = !flipped;
    setFlipped(next);
    onFlip?.(next);
  };

  const cardRef = useRef(null);
  const draggedRef = useRef(false);

  const x = useMotionValue(0);
  // A small tilt follows the finger. Enough feedback without overdoing it.
  const rotate = useTransform(x, [-240, 0, 240], [-8, 0, 8]);

  function handleDragEnd(_event, info) {
    const width = cardRef.current?.offsetWidth ?? 320;
    const threshold = Math.min(SWIPE_MAX, Math.max(SWIPE_MIN, width * SWIPE_RATIO));
    const projected = info.offset.x + info.velocity.x * MOMENTUM_LOOKAHEAD;

    if (Math.abs(projected) < threshold) {
      animate(x, 0, SPRING);
      return;
    }

    onSwipe?.(projected > 0 ? 1 : -1); // a flick can reverse a drag
  }

  return (
    <motion.div
      ref={cardRef}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      drag={disabled ? false : "x"}
      dragMomentum={false}
      style={{ x, rotate, perspective: 1400 }}
      onPointerDown={() => (draggedRef.current = false)}
      onDragStart={() => (draggedRef.current = true)}
      onDragEnd={handleDragEnd}
      onTap={() => !draggedRef.current && flip()}
      className="relative w-full max-w-sm cursor-grab touch-none select-none active:cursor-grabbing"
      role="button"
      tabIndex={0}
      aria-label={flipped ? t("questionShown") : t("tapToReveal")}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          flip();
        }
      }}
    >
      <motion.div
        className="relative aspect-[3/4] w-full transform-3d"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <Face>{front}</Face>
        <Face flipped>{back}</Face>
      </motion.div>
    </motion.div>
  );
}

function Face({ children, flipped = false }) {
  return (
    <div
      className="absolute inset-0 backface-hidden"
      style={flipped ? { transform: "rotateY(180deg)" } : undefined}
    >
      {children}
    </div>
  );
}
