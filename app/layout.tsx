import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PlayerProvider } from "@/src/context/PlayerContext";
import { CountryProvider } from "@/src/context/CountryContext";
import { LanguageProvider } from "@/src/context/LanguageContext";
import { DynamicLanguagesProvider } from "@/src/context/DynamicLanguagesContext";
import { Sidebar } from "@/src/components/Sidebar";
import { PlayerBar } from "@/src/components/PlayerBar";
import { CountrySwitcher } from "@/src/components/CountrySwitcher";
import { LanguageSwitcher } from "@/src/components/LanguageSwitcher";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Isai Flow – Multi-Language Internet Radio | Listen to Radio Worldwide",
  description: "Isai Flow is a multi-language internet radio aggregator. Listen to live radio stations from around the world in your preferred country and language. High-quality streams, minimal design.",
  keywords: ["Online Radio", "Live Radio", "Internet Radio", "Multi-Language Radio", "Isai Flow", "Radio Aggregator", "World Radio"],
  alternates: {
    canonical: "https://isaiflow.in",
  },
  openGraph: {
    title: "Isai Flow – Multi-Language Internet Radio",
    description: "Listen to live radio stations from around the world in your preferred country and language.",
    type: "website",
    url: "https://isaiflow.in",
    locale: "en_US",
    siteName: "Isai Flow",
  },
  twitter: {
    card: "summary_large_image",
    title: "Isai Flow – Multi-Language Internet Radio",
    description: "The best way to listen to radio online. High-quality streams, minimal design.",
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
    "@type": ["WebSite", "MobileApplication"],
    "name": "Isai Flow",
    "url": "https://isaiflow.in",
    "description": "Multi-language internet radio streaming service.",
    "logo": "https://isaiflow.in/favicon.ico",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web Browser",
    "sameAs": [
      "https://github.com/gurubaladhinesh/isai-flow"
    ]
  };

  return (
    <html lang="en" className="h-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} flex min-h-screen flex-col bg-[#050509] font-sans text-white`}
      >
        <PlayerProvider>
          <CountryProvider>
            <LanguageProvider>
              <DynamicLanguagesProvider>
                <div className="flex min-h-screen pb-16 sm:pb-20">
                  <Sidebar />
                  <main className="relative flex-1">
                    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-70">
                      <div className="absolute -left-32 top-[-10%] h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
                      <div className="absolute right-[-10%] top-1/2 h-72 w-72 rounded-full bg-fuchsia-500/15 blur-3xl" />
                    </div>
                    <div className="flex w-full flex-col gap-6 px-4 pb-4 pt-6 sm:px-6 sm:pt-8">
                      <div className="absolute right-4 top-4 z-30 flex gap-2 sm:right-6 sm:top-6">
                        <LanguageSwitcher />
                        <CountrySwitcher />
                      </div>
                      {children}
                    </div>
                  </main>
                </div>
                <PlayerBar />
              </DynamicLanguagesProvider>
            </LanguageProvider>
          </CountryProvider>
        </PlayerProvider>
      </body>
    </html>
  );
}
