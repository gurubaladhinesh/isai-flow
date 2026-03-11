import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PlayerProvider } from "@/src/context/PlayerContext";
import { Sidebar } from "@/src/components/Sidebar";
import { PlayerBar } from "@/src/components/PlayerBar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Isai Flow – Tamil Internet Radio",
  description: "Curated Tamil internet radio stations in a single player. Listen to handpicked streams from around the world.",
  keywords: ["Tamil Radio", "Isai Flow", "Internet Radio", "Tamil Music", "Live FM"],
  openGraph: {
    title: "Isai Flow – Tamil Internet Radio",
    description: "Curated Tamil internet radio stations in a single player.",
    type: "website",
    locale: "ta_IN",
    siteName: "Isai Flow",
  },
  twitter: {
    card: "summary_large_image",
    title: "Isai Flow – Tamil Internet Radio",
    description: "Curated Tamil internet radio stations in a single player.",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ta" className="h-full">
      <body
        className={`${inter.variable} flex min-h-screen flex-col bg-[#050509] font-sans text-white`}
      >
        <PlayerProvider>
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
        </PlayerProvider>
      </body>
    </html>
  );
}

