import type { Metadata, Viewport } from "next";
import { Gabarito, Noto_Serif_Tibetan, Plus_Jakarta_Sans } from "next/font/google";

import { site } from "@/content/site";

import "./globals.css";

/* The three families the design system briefs, self-hosted by next/font so the
 * page makes no render-blocking request to a font CDN. Each exposes the CSS
 * variable that styles/theme.generated.css points --font-display, --font-body
 * and --font-tibetan at.
 *
 * The design system's --font-tibetan stack names "Noto Sans Tibetan" first, but
 * Google Fonts does not publish that family — the board has always fallen back
 * to the serif. Loading the serif here matches what the board actually renders.
 */

const gabarito = Gabarito({
  variable: "--font-gabarito",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const notoTibetan = Noto_Serif_Tibetan({
  variable: "--font-noto-tibetan",
  subsets: ["tibetan"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  title: {
    default: `${site.name} — learn Tibetan`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    title: `${site.name} — learn Tibetan`,
    description: site.description,
    siteName: site.name,
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — learn Tibetan`,
    description: site.description,
  },
};

export const viewport: Viewport = {
  // adherence-allow: raw-hex — the theme-color meta tag cannot resolve a var()
  themeColor: "#EDF2F3", // --ground-100, the page ground
  colorScheme: "light", // the design system is light-only by intent
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${gabarito.variable} ${plusJakarta.variable} ${notoTibetan.variable}`}
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
