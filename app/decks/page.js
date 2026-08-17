"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import DeckTile from "@/components/DeckTile";
import { decks } from "@/data/decks";
import { useI18n } from "@/lib/i18n";

export default function DecksPage() {
  const { t } = useI18n();

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
          <DeckTile key={deck.id} deck={deck} index={i} />
        ))}
      </div>
    </main>
  );
}
