"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export const LOCALES = [
  { code: "en", label: "EN", name: "English" },
  { code: "id", label: "ID", name: "Bahasa Indonesia" },
];

const DEFAULT_LOCALE = "en";
const STORAGE_KEY = "unfold:locale";

// UI text only. Deck content is translated in data/decks.js next to the data.
const STRINGS = {
  en: {
    tagline: "A deck of questions for the conversations you keep meaning to have.",
    startCta: "Start Unfolding",
    back: "Back",
    decksTitle: "Pick your depth.",
    decksSubtitle: "Every deck is a different level of honesty. Start shallow, or don't.",
    levelN: "Level {n}",
    cardsN: "{n} cards",
    leaveDeck: "Leave deck",
    tapToReveal: "Tap to reveal the question",
    hintTap: "Tap the card to reveal it",
    hintSwipe: "Swipe to see the next one",
    questionShown: "Question shown. Swipe for the next one.",
    endTitle: "You've unfolded everything.",
    endSubtitle: "That's the whole deck. Go again, or find a deeper one.",
    restartDeck: "Restart Deck",
    playAnother: "Play Another Deck",
    toLightMode: "Switch to light mode",
    toDarkMode: "Switch to dark mode",
    language: "Language",
  },
  id: {
    tagline: "Satu dek pertanyaan untuk obrolan yang selalu kamu tunda.",
    startCta: "Mulai Unfold",
    back: "Kembali",
    decksTitle: "Pilih kedalamanmu.",
    decksSubtitle:
      "Tiap dek punya tingkat kejujuran yang berbeda. Mulai dari yang ringan, atau langsung dalam.",
    levelN: "Level {n}",
    cardsN: "{n} kartu",
    leaveDeck: "Keluar dari dek",
    tapToReveal: "Ketuk untuk membuka pertanyaan",
    hintTap: "Ketuk kartunya untuk membuka",
    hintSwipe: "Geser untuk kartu berikutnya",
    questionShown: "Pertanyaan tampil. Geser untuk kartu berikutnya.",
    endTitle: "Semuanya sudah terbuka.",
    endSubtitle: "Itu seluruh deknya. Ulangi lagi, atau cari yang lebih dalam.",
    restartDeck: "Ulangi Dek",
    playAnother: "Main Dek Lain",
    toLightMode: "Ganti ke mode terang",
    toDarkMode: "Ganti ke mode gelap",
    language: "Bahasa",
  },
};

const LocaleContext = createContext(null);

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState(DEFAULT_LOCALE);

  // Read after mount. The server render has to match the default, or React
  // will warn about a hydration mismatch.
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && STRINGS[saved]) setLocale(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const change = useCallback((next) => {
    setLocale(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // private mode, so the choice will not be saved
    }
  }, []);

  const value = useMemo(() => ({ locale, setLocale: change }), [locale, change]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

/**
 * t("cardsN", { n: 8 })  returns a UI string with the values filled in
 * tr(deck.title)         picks the active language from an { en, id } field
 */
export function useI18n() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useI18n must be used inside <LocaleProvider>");
  const { locale } = ctx;

  const t = useCallback(
    (key, vars) => {
      let out = STRINGS[locale]?.[key] ?? STRINGS[DEFAULT_LOCALE][key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) out = out.replaceAll(`{${k}}`, v);
      }
      return out;
    },
    [locale],
  );

  const tr = useCallback(
    (field) => (field && typeof field === "object" ? (field[locale] ?? field[DEFAULT_LOCALE]) : field),
    [locale],
  );

  return { ...ctx, t, tr };
}
