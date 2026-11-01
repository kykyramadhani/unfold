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
    navHow: "How it works",
    navCards: "The cards",
    navStory: "Our story",
    startTalking: "Start talking",
    menu: "Menu",
    close: "Close",
    heroEyebrowDesktop: "LESS SCROLLING. MORE CONNECTING.",
    heroEyebrowMobile: "THE ART OF REAL CONVERSATION",
    heroLine1: "Good talks",
    heroLine2: "start with",
    heroLine3: "one question.",
    heroBodyDesktop:
      "Thoughtful conversation cards that turn ordinary moments into meaningful connections. No awkward small talk. Just real stories.",
    heroBodyMobile: "Less small talk, more real connection. Thoughtful cards for the people who matter.",
    exploreCards: "Explore the cards",
    seeHow: "See how it works",
    socialProof: "For friends, lovers, and curious minds.",
    pickCard: "PICK A CARD. OPEN A CONVERSATION.",
    footerLeft: "ASK BETTER  ·  LISTEN DEEPER  ·  CONNECT MORE",
    footerRight: "MADE FOR THE MOMENTS THAT MATTER",
    decksEyebrowDesktop: "A LITTLE SOMETHING FOR EVERY MOOD",
    decksEyebrowMobile: "CHOOSE A DECK",
    decksTitle: "Where shall we begin?",
    decksSubtitleDesktop:
      "Pick a deck that feels right. There's no perfect answer — just a good conversation waiting to happen.",
    decksSubtitleMobile: "Pick a mood. Every great conversation begins somewhere.",
    exploreDecks: "EXPLORE THE DECKS",
    decksCount: "{decks} DECKS • {cards} CARDS",
    deckN: "DECK {n}",
    openDeck: "OPEN DECK",
    allDecks: "All decks",
    cardOf: "CARD {n} OF {total}",
    leaveDeck: "Leave deck",
    takeYourTimeMobile: "TAKE YOUR TIME",
    takeYourTimeDesktop: "TAKE YOUR TIME. THERE'S NO RUSH.",
    playLine1: "A good question can",
    playLine2: "change everything.",
    playBody: "Read the question out loud. Listen to the answer. Then follow wherever the conversation takes you.",
    makeSpace: "MAKE SPACE FOR A REAL CONVERSATION",
    tellStories: "TELL STORIES. DISCOVER SOMETHING NEW.",
    noRightWrong: "NO RIGHT OR WRONG ANSWERS",
    swipeMore: "Swipe to discover more",
    nextQuestion: "Next question",
    shuffle: "Shuffle",
    shuffleCard: "Shuffle card",
    tapToReveal: "Tap to reveal the question",
    hintTap: "Tap the card to reveal it",
    hintSwipe: "Swipe to see the next one",
    questionShown: "Question shown. Swipe for the next one.",
    endTitle: "You've unfolded everything.",
    endSubtitle: "That's the whole deck. Go again, or find another one.",
    restartDeck: "Restart deck",
    playAnother: "Play another deck",
    language: "Language",
  },
  id: {
    navHow: "Cara kerja",
    navCards: "Kartunya",
    navStory: "Cerita kami",
    startTalking: "Mulai ngobrol",
    menu: "Menu",
    close: "Tutup",
    heroEyebrowDesktop: "KURANGI SCROLL. PERBANYAK OBROLAN.",
    heroEyebrowMobile: "SENI OBROLAN YANG TULUS",
    heroLine1: "Obrolan baik",
    heroLine2: "dimulai dari",
    heroLine3: "satu pertanyaan.",
    heroBodyDesktop:
      "Kartu percakapan yang mengubah momen biasa jadi kedekatan yang berarti. Tanpa basa-basi canggung. Hanya cerita yang nyata.",
    heroBodyMobile: "Kurangi basa-basi, perbanyak kedekatan. Kartu penuh makna untuk orang-orang yang berarti.",
    exploreCards: "Jelajahi kartunya",
    seeHow: "Lihat cara kerjanya",
    socialProof: "Untuk teman, kekasih, dan pikiran yang penasaran.",
    pickCard: "PILIH KARTU. MULAI OBROLAN.",
    footerLeft: "TANYA LEBIH BAIK  ·  DENGAR LEBIH DALAM  ·  TERHUBUNG LEBIH DEKAT",
    footerRight: "UNTUK MOMEN YANG BERARTI",
    decksEyebrowDesktop: "SESUATU UNTUK SETIAP SUASANA HATI",
    decksEyebrowMobile: "PILIH DEK",
    decksTitle: "Mulai dari mana?",
    decksSubtitleDesktop:
      "Pilih dek yang terasa pas. Tidak ada jawaban sempurna — hanya obrolan seru yang menunggu terjadi.",
    decksSubtitleMobile: "Pilih suasana. Setiap obrolan hebat dimulai dari suatu tempat.",
    exploreDecks: "JELAJAHI DEK",
    decksCount: "{decks} DEK • {cards} KARTU",
    deckN: "DEK {n}",
    openDeck: "BUKA DEK",
    allDecks: "Semua dek",
    cardOf: "KARTU {n} DARI {total}",
    leaveDeck: "Keluar dari dek",
    takeYourTimeMobile: "SANTAI SAJA",
    takeYourTimeDesktop: "SANTAI SAJA. TIDAK ADA YANG BURU-BURU.",
    playLine1: "Satu pertanyaan bagus bisa",
    playLine2: "mengubah segalanya.",
    playBody: "Bacakan pertanyaannya. Dengarkan jawabannya. Lalu ikuti ke mana obrolan membawamu.",
    makeSpace: "SISIHKAN RUANG UNTUK OBROLAN NYATA",
    tellStories: "BERCERITA. TEMUKAN HAL BARU.",
    noRightWrong: "TIDAK ADA JAWABAN BENAR ATAU SALAH",
    swipeMore: "Geser untuk menemukan lebih banyak",
    nextQuestion: "Pertanyaan berikutnya",
    shuffle: "Acak",
    shuffleCard: "Acak kartu",
    tapToReveal: "Ketuk untuk membuka pertanyaan",
    hintTap: "Ketuk kartunya untuk membuka",
    hintSwipe: "Geser untuk kartu berikutnya",
    questionShown: "Pertanyaan tampil. Geser untuk kartu berikutnya.",
    endTitle: "Semuanya sudah terbuka.",
    endSubtitle: "Itu seluruh deknya. Ulangi lagi, atau cari dek lain.",
    restartDeck: "Ulangi dek",
    playAnother: "Main dek lain",
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
