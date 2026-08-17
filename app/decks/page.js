"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import DeckLoader from "@/components/DeckLoader";
import DeckTile from "@/components/DeckTile";
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

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8 sm:py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        {t("back")}
      </Link>

      <header className="mt-8 mb-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">{t("decksTitle")}</h1>
        <p className="mt-3 max-w-md text-muted">{t("decksSubtitle")}</p>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {decks.map((deck, i) => (
          <DeckTile key={deck.id} deck={deck} index={i} onOpen={open} />
        ))}
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
  );
}
