import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PlayerProvider } from "@/src/context/PlayerContext";
import { FavoritesProvider } from "@/src/context/FavoritesContext";
import { Sidebar } from "@/src/components/Sidebar";
import { PlayerBar } from "@/src/components/PlayerBar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Isai Flow – Listen to Tamil Radio Online | Best Live Tamil FM Stations",
  description: "Experience the best Tamil radio online with Isai Flow. Listen to high-quality live Tamil FM stations, Carnatic music, and film hits from around the world in one premium player.",
  keywords: ["Tamil Radio Online", "Live Tamil FM", "Isai Flow", "Tamil Internet Radio", "Tamil FM Stations", "Tamil Music Player", "Carnatic Radio"],
  alternates: {
    canonical: "https://isaiflow.in",
  },
  openGraph: {
    title: "Isai Flow – Listen to Tamil Radio Online | Best Live Tamil FM Stations",
    description: "Experience the best Tamil radio online with Isai Flow. Listen to high-quality live Tamil FM stations in one premium player.",
    type: "website",
    url: "https://isaiflow.in",
    locale: "ta_IN",
    siteName: "Isai Flow",
  },
  twitter: {
    card: "summary_large_image",
    title: "Isai Flow – Premium Tamil Internet Radio Player",
    description: "The best way to listen to Tamil radio online. High-quality streams, minimal design.",
  },
  robots: {
    index: true,
    follow: true,
  }
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["WebSite", "LocalBusiness"],
    "name": "Isai Flow",
    "url": "https://isaiflow.in",
    "description": "Premium Tamil internet radio streaming service.",
    "logo": "https://isaiflow.in/favicon.ico",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://github.com/gurubaladhinesh/isai-flow"
    ]
  };

  return (
    <html lang="ta" className="h-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google Analytics Placeholder */}
        {/* <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script> */}
      </head>
      <body
        className={`${inter.variable} flex min-h-screen flex-col bg-[#050509] font-sans text-white`}
      >
        <PlayerProvider>
          <FavoritesProvider>
          <div className="flex min-h-screen pb-16 sm:pb-20">
            <Sidebar />
            <main className="relative flex-1">
              <div className="pointer-events-none pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-70">
                <div className="absolute -left-32 top-[-10%] h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
                <div className="absolute right-[-10%] top-1/2 h-72 w-72 rounded-full bg-fuchsia-500/15 blur-3xl" />
              </div>
              <div className="flex w-full flex-col gap-6 px-4 pb-4 pt-6 sm:px-6 sm:pt-8">
                {children}
              </div>
            </main>
          </div>
          <PlayerBar />
          </FavoritesProvider>
        </PlayerProvider>
      </body>
    </html>
  );
}

