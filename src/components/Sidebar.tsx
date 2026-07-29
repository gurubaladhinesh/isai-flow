"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock, Heart, Library } from "lucide-react";
import { usePlayer } from "@/src/context/PlayerContext";
import { getStationUrl } from "@/src/lib/slug";
import type { Station } from "@/src/lib/radio-api";

function StationListItem({
  station,
  onPlay,
  isActive,
}: {
  station: Station;
  onPlay: () => void;
  isActive?: boolean;
}) {
  return (
    <div
      className={`flex min-h-9 w-full items-center gap-1 rounded-lg px-1 transition ${
        isActive
          ? "bg-[var(--accent)]/15 text-[var(--accent-bright)]"
          : "text-[var(--muted)] hover:bg-white/5 hover:text-[var(--text)]"
      }`}
    >
      <Link
        href={getStationUrl(station)}
        className="line-clamp-1 min-w-0 flex-1 px-1.5 py-2 text-[12px]"
      >
        {station.name || "Untitled Station"}
      </Link>
      <button
        type="button"
        onClick={onPlay}
        className="shrink-0 px-2 py-2 text-[10px] text-[var(--muted)] hover:text-[var(--accent-bright)]"
        aria-label={`Play ${station.name}`}
      >
        {station.bitrate ? `${station.bitrate} kbps` : "Play"}
      </button>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const {
    recentStations,
    favoriteStations,
    playStation,
    currentStation,
  } = usePlayer();

  const isHome = pathname === "/";

  return (
    <aside className="hidden h-full w-64 flex-shrink-0 flex-col border-r border-[var(--border)] bg-[rgba(10,16,14,0.88)] px-4 py-6 text-sm backdrop-blur-xl md:flex">
      <Link href="/" className="mb-8 flex items-center gap-3 px-1">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-deep)] text-xl font-semibold text-[var(--accent-bright)] shadow-[0_0_28px_rgba(62,207,180,0.28)]"
          style={{ fontFamily: "var(--font-noto-tamil), sans-serif" }}
        >
          இ
        </div>
        <div>
          <div className="font-display text-base font-semibold tracking-wide text-[var(--text)]">
            Isai Flow
          </div>
          <div className="text-[11px] text-[var(--muted)]">
            Tamil Internet Radio
          </div>
        </div>
      </Link>

      <nav className="space-y-1 px-0.5">
        <Link
          href="/"
          className={`flex min-h-10 w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium transition ${
            isHome
              ? "bg-[var(--accent)]/15 text-[var(--accent-bright)]"
              : "text-[var(--muted)] hover:bg-white/5 hover:text-[var(--text)]"
          }`}
        >
          <Library className="h-4 w-4" />
          <span>All Stations</span>
        </Link>
      </nav>

      <div className="mt-8 flex items-center gap-2 px-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
        <Heart className="h-3.5 w-3.5" />
        <span>Favorites</span>
      </div>
      <div className="mt-2 max-h-40 space-y-0.5 overflow-y-auto pr-1">
        {favoriteStations.length === 0 ? (
          <div className="rounded-lg px-2.5 py-2 text-[11px] text-[var(--muted)]">
            Heart a station to save it here.
          </div>
        ) : (
          favoriteStations.map((station) => (
            <StationListItem
              key={station.stationuuid}
              station={station}
              isActive={currentStation?.stationuuid === station.stationuuid}
              onPlay={() => playStation(station)}
            />
          ))
        )}
      </div>

      <div className="mt-6 flex items-center gap-2 px-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
        <Clock className="h-3.5 w-3.5" />
        <span>Recent</span>
      </div>
      <div className="mt-2 flex-1 space-y-0.5 overflow-y-auto pr-1">
        {recentStations.length === 0 ? (
          <div className="rounded-lg px-2.5 py-2 text-[11px] text-[var(--muted)]">
            Stations you play will appear here.
          </div>
        ) : (
          recentStations.map((station) => (
            <StationListItem
              key={station.stationuuid}
              station={station}
              isActive={currentStation?.stationuuid === station.stationuuid}
              onPlay={() => playStation(station)}
            />
          ))
        )}
      </div>

      <div className="mt-auto border-t border-[var(--border)] pt-5 px-1">
        <a
          href="https://github.com/gurubaladhinesh/isai-flow"
          target="_blank"
          rel="noreferrer"
          className="text-[11px] text-[var(--muted)] transition hover:text-[var(--warm)]"
        >
          Open source on GitHub
        </a>
      </div>
    </aside>
  );
}
