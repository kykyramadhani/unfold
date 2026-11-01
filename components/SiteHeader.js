"use client";

import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

import Button from "@/components/ui/Button";
import { LOCALES, useI18n } from "@/lib/i18n";

/** Two sheets of paper, drawn in the same 40px box the Figma logo uses. */
export function Logo({ className = "" }) {
  return (
    <Link href="/" className={`flex items-center gap-2 lg:gap-3 ${className}`} aria-label="unfold.">
      <svg viewBox="-4 0 47 40" className="h-7 w-auto lg:h-10" aria-hidden>
        <rect width="22" height="27" rx="5" fill="#fb9677" transform="translate(11.29 22.24) rotate(18) translate(-11 -13.5)" />
        <rect width="22" height="27" rx="5" fill="#332347" transform="translate(28.94 18.44) rotate(-14) translate(-11 -13.5)" />
      </svg>
      <span className="text-[22px] font-bold text-text lg:text-[29px]">unfold.</span>
    </Link>
  );
}

/** EN / ID switch. The active language is dark, the other one is muted. */
export function LangSwitch({ className = "" }) {
  const { locale, setLocale, t } = useI18n();
  return (
    <div role="group" aria-label={t("language")} className={`flex items-center gap-2 text-sm font-bold ${className}`}>
      {LOCALES.map(({ code, label, name }, i) => (
        <span key={code} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden>/</span>}
          <button
            type="button"
            onClick={() => setLocale(code)}
            aria-label={name}
            aria-pressed={locale === code}
            className={`transition-colors focus:outline-none focus-visible:underline ${locale === code ? "text-text" : "text-muted hover:text-text"}`}
          >
            {label}
          </button>
        </span>
      ))}
    </div>
  );
}

/**
 * Shared top bar for the home and deck pages. `mobileAction` picks the right
 * hand icon on phones: a menu on the home page, a close button elsewhere.
 */
export default function SiteHeader({ mobileAction = "menu" }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <header className="relative mx-auto w-full max-w-[1440px] px-6 lg:px-[73px]">
      <div className="flex h-[84px] items-center justify-between border-b border-line lg:h-[105px]">
        <Logo />

        {/* "How it works" and "Our story" have no pages yet, so they stay plain text. */}
        <nav className="hidden items-center gap-12 text-sm font-medium text-text lg:flex">
          <span>{t("navHow")}</span>
          <Link href="/decks" className="hover:text-ink">{t("navCards")}</Link>
          <span>{t("navStory")}</span>
        </nav>

        <div className="hidden items-center gap-8 lg:flex">
          <LangSwitch />
          <Button href="/decks" className="h-14 px-8">
            {t("startTalking")} <ArrowUpRight className="size-4" strokeWidth={2.5} aria-hidden />
          </Button>
        </div>

        {mobileAction === "menu" ? (
          <button
            type="button"
            className="text-[26px] leading-none text-ink lg:hidden"
            aria-label={t("menu")}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "×" : "☰"}
          </button>
        ) : (
          <Link href="/" aria-label={t("close")} className="text-[26px] leading-none text-ink lg:hidden">
            ×
          </Link>
        )}
      </div>

      {open && (
        <div className="absolute inset-x-6 top-[84px] z-30 flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 shadow-lg lg:hidden">
          <Link href="/decks" className="text-sm font-medium text-text">{t("navCards")}</Link>
          <LangSwitch />
        </div>
      )}
    </header>
  );
}
