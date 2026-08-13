"use client";

import { useEffect, useState } from "react";
import { Clock, Heart, Menu, X } from "lucide-react";
import { usePlayer } from "@/src/context/PlayerContext";
import { LanguageNav } from "@/src/components/LanguageNav";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const {
    recentStations,
    favoriteStations,
    playStation,
    currentStation,
  } = usePlayer();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-white/5 text-[var(--text)] transition hover:bg-white/10"
        aria-label="Open library"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-[70] md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-[min(100%,20rem)] flex-col overscroll-y-contain border-l border-[var(--border)] bg-[#0d1411] p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="font-display text-lg font-semibold">Library</div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-white/5"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6" onClick={() => setOpen(false)}>
              <LanguageNav />
            </div>

            <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              <Heart className="h-3.5 w-3.5" />
              Favorites
            </div>
            <div className="scroll-fade-y mb-6 max-h-40 space-y-1">
              {favoriteStations.length === 0 ? (
                <p className="text-xs text-[var(--muted)]">No favorites yet.</p>
              ) : (
                favoriteStations.map((station) => (
                  <button
                    key={station.stationuuid}
                    type="button"
                    className="flex min-h-10 w-full items-center rounded-lg px-2 text-left text-sm text-[var(--text)] hover:bg-white/5"
                    onClick={() => {
                      playStation(station);
                      setOpen(false);
                    }}
                  >
                    <span className="line-clamp-1">
                      {currentStation?.stationuuid === station.stationuuid
                        ? "▶ "
                        : ""}
                      {station.name}
                    </span>
                  </button>
                ))
              )}
            </div>

            <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              <Clock className="h-3.5 w-3.5" />
              Recent
            </div>
            <div className="scroll-fade-y min-h-0 flex-1 space-y-1">
              {recentStations.length === 0 ? (
                <p className="text-xs text-[var(--muted)]">
                  Play a station to build history.
                </p>
              ) : (
                recentStations.map((station) => (
                  <button
                    key={station.stationuuid}
                    type="button"
                    className="flex min-h-10 w-full items-center rounded-lg px-2 text-left text-sm text-[var(--text)] hover:bg-white/5"
                    onClick={() => {
                      playStation(station);
                      setOpen(false);
                    }}
                  >
                    <span className="line-clamp-1">{station.name}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
