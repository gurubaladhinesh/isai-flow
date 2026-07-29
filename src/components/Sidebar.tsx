"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock, Heart, Library } from "lucide-react";
import { usePlayer } from "@/src/context/PlayerContext";

function StationListButton({
  name,
  bitrate,
  onClick,
  isActive,
}: {
  name: string;
  bitrate?: number;
  onClick: () => void;
  isActive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-9 w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left transition ${
        isActive
          ? "bg-[var(--accent)]/15 text-[var(--accent-bright)]"
          : "text-[var(--muted)] hover:bg-white/5 hover:text-[var(--text)]"
      }`}
    >
      <span className="line-clamp-1 text-[12px]">{name || "Untitled Station"}</span>
      <span className="shrink-0 text-[10px] text-[var(--muted)]">
        {bitrate ? `${bitrate} kbps` : ""}
      </span>
    </button>
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
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-deep)] text-xl font-semibold text-[var(--accent-bright)] shadow-[0_0_28px_rgba(62,207,180,0.28)]">
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
            <StationListButton
              key={station.stationuuid}
              name={station.name}
              bitrate={station.bitrate}
              isActive={currentStation?.stationuuid === station.stationuuid}
              onClick={() => playStation(station)}
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
            <StationListButton
              key={station.stationuuid}
              name={station.name}
              bitrate={station.bitrate}
              isActive={currentStation?.stationuuid === station.stationuuid}
              onClick={() => playStation(station)}
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
