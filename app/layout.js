import { Geist } from "next/font/google";
import "./globals.css";

import SettingsBar from "@/components/SettingsBar";
import { LocaleProvider } from "@/lib/i18n";
import { NO_FLASH_SCRIPT, ThemeProvider } from "@/lib/theme";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata = {
  title: "Unfold: cards for deep talks",
  description: "An interactive card deck for deep talks and ice breakers.",
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f2ee" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0e13" },
  ],
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* Set the theme class before the first paint so there is no flash. */}
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col overscroll-none bg-app font-sans text-ink">
        <ThemeProvider>
          <LocaleProvider>
            <SettingsBar />
            {children}
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
