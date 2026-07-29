"use client";

import { Heart, PauseCircle, PlayCircle } from "lucide-react";
import type { Station } from "@/src/lib/radio-api";
import { usePlayer } from "@/src/context/PlayerContext";

export function StationPlayControls({ station }: { station: Station }) {
  const {
    playStation,
    togglePlay,
    currentStation,
    isPlaying,
    toggleFavorite,
    isFavorite,
  } = usePlayer();

  const isCurrent = currentStation?.stationuuid === station.stationuuid;
  const favorited = isFavorite(station.stationuuid);

  const handlePlay = () => {
    if (isCurrent) {
      togglePlay();
      return;
    }
    playStation(station);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handlePlay}
        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[#04110e] transition hover:bg-[var(--accent-bright)]"
      >
        {isCurrent && isPlaying ? (
          <>
            <PauseCircle className="h-5 w-5" />
            <span>Pause</span>
          </>
        ) : (
          <>
            <PlayCircle className="h-5 w-5" />
            <span>{isCurrent ? "Resume" : "Play Station"}</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={() => toggleFavorite(station)}
        className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition ${
          favorited
            ? "border-[var(--warm)]/40 bg-[var(--warm-soft)] text-[var(--warm)]"
            : "border-[var(--border)] bg-white/5 text-[var(--muted)] hover:text-[var(--text)]"
        }`}
        aria-label={favorited ? "Remove favorite" : "Add favorite"}
      >
        <Heart className={`h-4 w-4 ${favorited ? "fill-current" : ""}`} />
        <span>{favorited ? "Favorited" : "Favorite"}</span>
      </button>
    </div>
  );
}
