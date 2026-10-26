import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Cormorant_Garamond, Great_Vibes, JetBrains_Mono } from "next/font/google";
import { siteConfig } from "@/config/site";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});
const body = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});
const script = Great_Vibes({
  subsets: ["latin", "vietnamese"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${siteConfig.seo.siteName} · ${siteConfig.graduate.fullName}`,
    template: `%s · ${siteConfig.seo.siteName}`,
  },
  description: siteConfig.seo.description,
  applicationName: siteConfig.seo.siteName,
  openGraph: {
    type: "website",
    siteName: siteConfig.seo.siteName,
    title: siteConfig.seo.siteName,
    description: siteConfig.seo.description,
    locale: "vi_VN",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#080B18",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${display.variable} ${body.variable} ${mono.variable} ${script.variable}`} suppressHydrationWarning>
      <head>
        {/* Marks JS as available before first paint so motion-only styles never hide content for no-JS visitors. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
