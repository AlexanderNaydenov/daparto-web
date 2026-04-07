import type { Metadata } from "next";
import { Barlow, Barlow_Condensed, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { DraftModeBanner } from "@/components/draft-mode-banner";
import { PreviewWrapper } from "@/components/preview-wrapper";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SiteTopBanner } from "@/components/site-top-banner";
import { defaultLocale, isAppLocale, type AppLocale } from "@/i18n/config";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Daparto — Ersatzteile vergleichen",
    template: "%s · Daparto",
  },
  description:
    "Vergleichen Sie Ersatzteile aus vielen Quellen — strukturiert nach Kategorien, mit klaren Merkmalen und schneller Orientierung.",
};

async function resolveLocale(): Promise<AppLocale> {
  const headersList = await headers();
  const raw = headersList.get("x-locale");
  return raw && isAppLocale(raw) ? raw : defaultLocale;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await resolveLocale();

  return (
    <html
      lang={locale}
      className={`${barlow.variable} ${barlowCondensed.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-[var(--brand-ink)]">
        <DraftModeBanner />
        <SiteTopBanner locale={locale} />
        <SiteHeader locale={locale} />
        <div className="flex-1">
          <PreviewWrapper>{children}</PreviewWrapper>
        </div>
        <SiteFooter locale={locale} />
      </body>
    </html>
  );
}
