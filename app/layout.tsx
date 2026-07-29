import type { Metadata } from "next";
import { Outfit, Noto_Sans_Tamil } from "next/font/google";
import "./globals.css";
import { PlayerProvider } from "@/src/context/PlayerContext";
import { Sidebar } from "@/src/components/Sidebar";
import { PlayerBar } from "@/src/components/PlayerBar";
import { MobileNav } from "@/src/components/MobileNav";

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
  title: "Isai Flow – Listen to Tamil Radio Online | Best Live Tamil FM Stations",
  description:
    "Experience the best Tamil radio online with Isai Flow. Listen to high-quality live Tamil FM stations, Carnatic music, and film hits from around the world in one premium player.",
  keywords: [
    "Tamil Radio Online",
    "Live Tamil FM",
    "Isai Flow",
    "Tamil Internet Radio",
    "Tamil FM Stations",
    "Tamil Music Player",
    "Carnatic Radio",
  ],
  alternates: {
    canonical: "https://isaiflow.in",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%23121a17' width='100' height='100' rx='20'/><text x='50' y='68' font-size='52' text-anchor='middle' fill='%233ecfb4'>இ</text></svg>",
  },
  openGraph: {
    title: "Isai Flow – Listen to Tamil Radio Online | Best Live Tamil FM Stations",
    description:
      "Experience the best Tamil radio online with Isai Flow. Listen to high-quality live Tamil FM stations in one premium player.",
    type: "website",
    url: "https://isaiflow.in",
    locale: "ta_IN",
    siteName: "Isai Flow",
  },
  twitter: {
    card: "summary_large_image",
    title: "Isai Flow – Premium Tamil Internet Radio Player",
    description:
      "The best way to listen to Tamil radio online. High-quality streams, minimal design.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["WebSite", "RadioBroadcastService"],
    name: "Isai Flow",
    url: "https://isaiflow.in",
    description:
      "Premium Tamil internet radio streaming service featuring live Tamil FM stations, Carnatic music, and film hits from around the world.",
    logo: "https://isaiflow.in/favicon.ico",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    sameAs: ["https://github.com/gurubaladhinesh/isai-flow"],
    inLanguage: "ta",
    genre: ["Tamil Music", "Carnatic Music", "Tamil Film Songs", "FM Radio"],
    offers: {
      "@type": "Offer",
      category: "Subscription",
      price: "0",
      priceCurrency: "USD",
      description: "Free access to Tamil radio stations worldwide",
    },
  };

  return (
    <html lang="ta" className="h-full">
      <head>
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
        <PlayerProvider>
          <div className="flex min-h-screen pb-20 sm:pb-24">
            <Sidebar />
            <main className="relative flex-1">
              <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-mesh opacity-60" />
              <div className="flex w-full flex-col gap-6 px-4 pb-4 pt-5 sm:px-6 sm:pt-7">
                <div className="flex items-center justify-between md:hidden">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--accent-deep)] text-lg font-semibold text-[var(--accent-bright)] shadow-[0_0_24px_rgba(62,207,180,0.25)]">
                      இ
                    </div>
                    <div>
                      <div className="font-display text-base font-semibold tracking-wide">
                        Isai Flow
                      </div>
                      <div className="text-[11px] text-[var(--muted)]">
                        Tamil Internet Radio
                      </div>
                    </div>
                  </div>
                  <MobileNav />
                </div>
                {children}
              </div>
            </main>
          </div>
          <PlayerBar />
        </PlayerProvider>
      </body>
    </html>
  );
}
