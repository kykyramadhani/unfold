import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

import { LocaleProvider } from "@/lib/i18n";

const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], axes: ["opsz"] });

export const metadata = {
  title: "Unfold: cards for deep talks",
  description: "An interactive card deck for deep talks and ice breakers.",
};

export const viewport = {
  themeColor: "#f9f7f1",
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col overscroll-none bg-app font-sans text-ink">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
