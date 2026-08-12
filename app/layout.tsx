import type { Metadata } from "next";
import { Outfit, Noto_Sans_Tamil } from "next/font/google";
import "./globals.css";
import { PlayerProvider } from "@/src/context/PlayerContext";
import { Sidebar } from "@/src/components/Sidebar";
import { PlayerBar } from "@/src/components/PlayerBar";
import { MobileNav } from "@/src/components/MobileNav";
import { Footer } from "@/src/components/Footer";
import { GoogleAnalytics } from "@/src/components/GoogleAnalytics";
import { SITE_NAME, SITE_URL } from "@/src/lib/site";
import { buildWebsiteJsonLd } from "@/src/lib/seo";

const GOOGLE_SITE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const notoTamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-tamil",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} – Listen to Tamil Radio Online | Best Live Tamil FM Stations`,
  description:
    "Experience the best Tamil radio online with Isai Flow. Listen to high-quality live Tamil FM stations, Carnatic music, and film hits from around the world in one premium player.",
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%23121a17' width='100' height='100' rx='20'/><text x='50' y='68' font-size='52' text-anchor='middle' fill='%233ecfb4'>இ</text></svg>",
  },
  openGraph: {
    title: `${SITE_NAME} – Listen to Tamil Radio Online | Best Live Tamil FM Stations`,
    description:
      "Experience the best Tamil radio online with Isai Flow. Listen to high-quality live Tamil FM stations in one premium player.",
    type: "website",
    url: SITE_URL,
    locale: "ta_IN",
    siteName: SITE_NAME,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} – Tamil Internet Radio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} – Premium Tamil Internet Radio Player`,
    description:
      "The best way to listen to Tamil radio online. High-quality streams, minimal design.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
  ...(GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const jsonLd = buildWebsiteJsonLd();

  return (
    <html lang="ta" className="h-full">
      <head>
        <link rel="preconnect" href="https://de1.api.radio-browser.info" />
        <link rel="dns-prefetch" href="https://de1.api.radio-browser.info" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${outfit.variable} ${notoTamil.variable} flex min-h-screen flex-col text-[var(--text)]`}
        style={
          {
            ["--font-display" as string]: "var(--font-outfit), system-ui, sans-serif",
            ["--font-body" as string]:
              "var(--font-noto-tamil), var(--font-outfit), system-ui, sans-serif",
            fontFamily: "var(--font-body)",
          } as React.CSSProperties
        }
      >
        <GoogleAnalytics />
        <PlayerProvider>
          <div className="flex min-h-screen pb-20 sm:pb-24">
            <Sidebar />
            <main className="relative flex-1">
              <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-mesh opacity-60" />
              <div className="flex w-full flex-col gap-6 px-4 pb-8 pt-5 sm:px-6 sm:pb-10 sm:pt-7">
                <div className="flex items-center justify-between md:hidden">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--accent-deep)] text-lg font-semibold text-[var(--accent-bright)] shadow-[0_0_24px_rgba(62,207,180,0.25)]"
                      style={{ fontFamily: "var(--font-noto-tamil), sans-serif" }}
                    >
                      இ
                    </div>
                    <div>
                      <div className="font-display text-base font-semibold tracking-wide">
                        {SITE_NAME}
                      </div>
                      <div className="text-[11px] text-[var(--muted)]">
                        Tamil Internet Radio
                      </div>
                    </div>
                  </div>
                  <MobileNav />
                </div>
                {children}
                <Footer />
              </div>
            </main>
          </div>
          <PlayerBar />
        </PlayerProvider>
      </body>
    </html>
  );
}
