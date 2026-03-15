"use client";

import { Library, Clock, Star, Trash2, Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";
import { usePlayer } from "@/src/context/PlayerContext";
import { useFavorites } from "@/src/context/FavoritesContext";

export function Sidebar() {
  const { recentStations, playStation } = usePlayer();
  const { favoriteStations, toggleFavorite } = useFavorites();

  return (
    <aside className="hidden h-full w-64 flex-shrink-0 flex-col border-r border-white/5 bg-gradient-to-b from-[#111111] to-black/90 px-4 py-6 text-sm text-zinc-200 md:flex">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-semibold">
          இ
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-zinc-500">
            Isai Flow
          </div>
          <div className="text-[11px] text-zinc-500">
            Tamil Internet Radio
          </div>
        </div>
      </div>

      <nav className="space-y-1 px-1">
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
        >
          <Library className="h-4 w-4" />
          <span>All Stations</span>
        </button>
      </nav>

      <div className="mt-8 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        <Star className="h-3 w-3" />
        <span>Favorites</span>
      </div>

      <div className="mt-3 space-y-1 pr-1 text-xs">
        {favoriteStations.length === 0 ? (
          <div className="rounded-md px-2 py-2 text-[11px] text-zinc-500">
            Star stations from the dashboard to add them here.
          </div>
        ) : (
          favoriteStations.map((station) => (
            <div
              key={station.stationuuid}
              className="flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-left text-zinc-300 transition hover:bg-white/5 group"
            >
              <button
                type="button"
                onClick={() => playStation(station)}
                className="min-w-0 flex-1 text-left"
              >
                <span className="line-clamp-1 text-[11px]">
                  {station.name || "Untitled Station"}
                </span>
                <span className="block text-[10px] text-zinc-500">
                  {station.bitrate ? `${station.bitrate} kbps` : ""}
                </span>
              </button>
              <button
                type="button"
                onClick={() => toggleFavorite(station)}
                className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded text-zinc-400 transition hover:bg-white/10 hover:text-red-400"
                aria-label="Remove from favorite"
                title="Remove from favorite"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        <Clock className="h-3 w-3" />
        <span>Recent</span>
      </div>

      <div className="mt-3 flex-1 min-h-0 space-y-1 overflow-y-auto pr-1 text-xs">
        {recentStations.length === 0 ? (
          <div className="rounded-md px-2 py-2 text-[11px] text-zinc-500">
            Stations you play will appear here.
          </div>
        ) : (
          recentStations.map((station) => (
            <button
              key={station.stationuuid}
              type="button"
              onClick={() => playStation(station)}
              className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-zinc-300 transition hover:bg-white/5 hover:text-white"
            >
              <span className="line-clamp-1 text-[11px]">
                {station.name || "Untitled Station"}
              </span>
              <span className="text-[10px] text-zinc-500">
                {station.bitrate ? `${station.bitrate} kbps` : ""}
              </span>
            </button>
          ))
        )}
      </div>
      <div className="mt-auto border-t border-white/5 pt-6 px-1">
        <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold mb-4">
          Connect
        </div>
        <div className="grid grid-cols-5 gap-2">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white" title="Facebook">
            <Facebook className="h-4 w-4" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white" title="X (Twitter)">
            <Twitter className="h-4 w-4" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white" title="Instagram">
            <Instagram className="h-4 w-4" />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white" title="YouTube">
            <Youtube className="h-4 w-4" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white" title="LinkedIn">
            <Linkedin className="h-4 w-4" />
          </a>
        </div>
      </div>
    </aside>
  );
}

