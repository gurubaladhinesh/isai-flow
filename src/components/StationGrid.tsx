"use client";

import { forwardRef, memo, useCallback } from "react";
import Link from "next/link";
import { Heart, PlayCircle } from "lucide-react";
import type { Station } from "@/src/lib/radio-api";
import { usePlayer } from "@/src/context/PlayerContext";
import { getStationUrl } from "@/src/lib/slug";
import { StationArtworkThumb } from "@/src/components/StationArtwork";
import { StationGridSkeleton } from "@/src/components/StationGridSkeleton";

interface StationGridProps {
  stations: Station[];
  loadingCount?: number;
  priorityCount?: number;
  loadTriggerIndex?: number;
  onLoadTrigger?: (node: HTMLDivElement | null) => void;
}

const StationTile = memo(
  forwardRef<
    HTMLDivElement,
    {
      station: Station;
      isCurrent: boolean;
      isPlaying: boolean;
      onPlay: () => void;
      priority?: boolean;
    }
  >(function StationTile(
    { station, isCurrent, isPlaying, onPlay, priority },
    ref,
  ) {
  const { toggleFavorite, isFavorite } = usePlayer();
  const favorited = isFavorite(station.stationuuid);

  return (
    <div
      ref={ref}
      className="station-tile station-tile-virtualized group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.03)] p-2.5 text-left text-xs text-[var(--text)] transition duration-300 hover:border-[var(--accent)]/50 hover:bg-[rgba(47,158,138,0.08)]"
    >
      <Link
        href={getStationUrl(station)}
        className="absolute inset-0 z-0"
        aria-label={`Open ${station.name}`}
        prefetch
      />

      <div className="relative z-10 mb-2.5 aspect-square w-full overflow-hidden rounded-xl bg-[#15201c]">
        <StationArtworkThumb
          src={station.favicon}
          alt={station.name || "Station"}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />

        <button
          type="button"
          className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 backdrop-blur-[2px] transition group-hover:opacity-100"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onPlay();
          }}
          aria-label={`Play ${station.name}`}
        >
          <PlayCircle className="h-10 w-10 text-[var(--accent-bright)] drop-shadow-lg" />
        </button>

        <button
          type="button"
          className={`absolute right-1.5 top-1.5 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/55 backdrop-blur transition hover:scale-105 ${
            favorited ? "text-[var(--warm)]" : "text-white/80 opacity-0 group-hover:opacity-100"
          }`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(station);
          }}
          aria-label={favorited ? "Remove favorite" : "Add favorite"}
        >
          <Heart className={`h-3.5 w-3.5 ${favorited ? "fill-current" : ""}`} />
        </button>

        {isCurrent && isPlaying ? (
          <div className="absolute left-1.5 top-1.5 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-medium text-[var(--accent-bright)] backdrop-blur">
            Live
          </div>
        ) : null}
      </div>

      <div className="relative z-10 space-y-0.5 px-0.5">
        <div className="line-clamp-1 font-display text-[13px] font-semibold">
          {station.name || "Untitled Station"}
        </div>
        <div className="flex items-center justify-between text-[10px] text-[var(--muted)]">
          <span className="line-clamp-1">
            {station.state || station.country || "Tamil"}
          </span>
          {station.bitrate ? (
            <span className="ml-2 rounded-md border border-white/10 px-1.5 py-0.5 text-[10px]">
              {station.bitrate}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
  }),
);

export function StationGrid({
  stations,
  loadingCount = 0,
  priorityCount = 0,
  loadTriggerIndex,
  onLoadTrigger,
}: StationGridProps) {
  const { playStation, currentStation, isPlaying } = usePlayer();

  const handlePlay = useCallback(
    (station: Station) => {
      playStation(station);
    },
    [playStation],
  );

  if (stations.length === 0 && loadingCount === 0) {
    return (
      <div className="flex h-40 flex-1 items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-white/[0.02] text-sm text-[var(--muted)]">
        No stations match your search. Try another name or tag.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
      {stations.map((station, index) => {
        const isCurrent = currentStation?.stationuuid === station.stationuuid;

        return (
          <StationTile
            key={station.stationuuid}
            station={station}
            isCurrent={isCurrent}
            isPlaying={isPlaying}
            onPlay={() => handlePlay(station)}
            priority={index < priorityCount}
            ref={
              loadTriggerIndex === index
                ? onLoadTrigger
                : undefined
            }
          />
        );
      })}
      {loadingCount > 0 ? <StationGridSkeleton count={loadingCount} inline /> : null}
    </div>
  );
}
