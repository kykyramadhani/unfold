"use client";

import { Moon, Sun } from "lucide-react";

import { LOCALES, useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";

/** Theme and language controls, fixed to the top right on every screen. */
export default function SettingsBar() {
  const { theme, toggle } = useTheme();
  const { locale, setLocale, t } = useI18n();
  const dark = theme === "dark";

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 sm:top-5 sm:right-6">
      <div
        role="group"
        aria-label={t("language")}
        className="flex items-center rounded-full bg-surface/80 p-1 ring-1 ring-line backdrop-blur-sm"
      >
        {LOCALES.map(({ code, label, name }) => (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            aria-label={name}
            aria-pressed={locale === code}
            className={`rounded-full px-2.5 py-1 text-xs font-bold tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
              locale === code ? "bg-brand text-neutral-900" : "text-muted hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={toggle}
        aria-label={dark ? t("toLightMode") : t("toDarkMode")}
        className="rounded-full bg-surface/80 p-2.5 text-ink ring-1 ring-line backdrop-blur-sm transition-colors hover:bg-ink/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </button>
    </div>
  );
}
