"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { HeroCardsDesktop, HeroCardsMobile } from "@/components/HeroCards";
import SiteHeader from "@/components/SiteHeader";
import Button from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";

const EYEBROW = "text-[10px] leading-[15px] font-bold tracking-[1.2px] sm:text-xs sm:leading-[18px]";

export default function HomePage() {
  const { t } = useI18n();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-6 lg:px-[73px]">
        <div className="grid flex-1 items-center gap-10 py-10 xl:grid-cols-[1fr_605px] xl:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="xl:pl-9"
          >
            <p className={`${EYEBROW} text-ink`}>
              <span className="xl:hidden">{t("heroEyebrowMobile")}</span>
              <span className="hidden xl:inline">{t("heroEyebrowDesktop")}</span>
            </p>

            <h1 className="mt-5 font-display text-[53px] leading-[1.2] font-semibold text-ink md:text-[72px] md:leading-[1.15] xl:mt-8 xl:text-[89px] xl:leading-[108px]">
              {t("heroLine1")}
              <br />
              {t("heroLine2")}
              <br />
              <span className="text-accent">{t("heroLine3")}</span>
            </h1>

            <p className="mt-6 max-w-[555px] text-base leading-[25px] text-muted xl:mt-8 xl:text-[19px] xl:leading-[30px]">
              <span className="xl:hidden">{t("heroBodyMobile")}</span>
              <span className="hidden xl:inline">{t("heroBodyDesktop")}</span>
            </p>

            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center xl:mt-12 xl:gap-8">
              <Button href="/decks" size="lg" className="h-14 w-full sm:w-[250px] xl:h-16">
                {t("exploreCards")} <ArrowUpRight className="size-4" strokeWidth={2.5} aria-hidden />
              </Button>
              <Link href="/decks" className="hidden items-center gap-2 text-base font-bold text-text hover:text-ink sm:inline-flex">
                {t("seeHow")} <ArrowUpRight className="size-4" strokeWidth={2.5} aria-hidden />
              </Link>
            </div>

            <div className="mt-12 hidden items-center gap-5 xl:flex">
              <div className="flex">
                {[1, 2, 3].map((n) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={n} src={`/figma/avatar-${n}.svg`} alt="" className="-mr-2 size-[37px] first:ml-0" />
                ))}
              </div>
              <p className="pl-2 text-[15px] font-medium text-muted">{t("socialProof")}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="xl:hidden">
              <p className={`${EYEBROW} mb-6 text-center text-muted`}>{t("pickCard")}</p>
              <HeroCardsMobile />
            </div>
            <div className="hidden xl:block">
              <HeroCardsDesktop />
            </div>
          </motion.div>
        </div>

        <footer className="mt-10 hidden items-center justify-between border-t border-line py-5 text-xs font-bold tracking-[1.2px] text-muted md:flex xl:px-9">
          <span className="whitespace-pre">{t("footerLeft")}</span>
          <span>{t("footerRight")}</span>
        </footer>
      </main>
    </>
  );
}
