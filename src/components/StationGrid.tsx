"use client";

import Image from "next/image";
import { PlayCircle } from "lucide-react";
import { useMemo, useState } from "react";
import type { Station } from "@/src/lib/radio-api";
import { usePlayer } from "@/src/context/PlayerContext";

interface StationGridProps {
  stations: Station[];
}

function StationTile({
  station,
  isCurrent,
  isPlaying,
  onPlay,
}: {
  station: Station;
  isCurrent: boolean;
  isPlaying: boolean;
  onPlay: () => void;
}) {
  const [logoOk, setLogoOk] = useState(true);

  const logoSrc = useMemo(() => {
    const candidate = station.favicon?.trim();
    if (!candidate) return "/station-default.svg";
    if (!logoOk) return "/station-default.svg";
    return candidate;
  }, [station.favicon, logoOk]);

  return (
    <button
      type="button"
      onClick={onPlay}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-lg border border-white/5 bg-gradient-to-br from-white/5 via-white/2 to-black/40 p-2 text-left text-xs text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:border-violet-500/80 hover:shadow-lg hover:shadow-violet-500/15"
    >
      <div className="relative mb-2 aspect-square w-full overflow-hidden rounded-md bg-zinc-900">
        <Image
          src={logoSrc}
          alt={station.name || "Station"}
          fill
          sizes="96px"
          className="object-cover transition duration-300 group-hover:scale-105 group-hover:brightness-110"
          onError={() => setLogoOk(false)}
        />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition group-hover:opacity-100" />

        <div className="pointer-events-none absolute bottom-1.5 right-1.5 opacity-0 drop-shadow-lg transition group-hover:opacity-100">
          <PlayCircle className="h-7 w-7 text-violet-300" />
        </div>

        {isCurrent && isPlaying ? (
          <div className="absolute left-1.5 top-1.5 rounded-full bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-emerald-300 backdrop-blur">
            Live
          </div>
        ) : null}
      </div>

      <div className="space-y-0.5">
        <div className="line-clamp-1 text-[12px] font-semibold">
          {station.name || "Untitled Station"}
        </div>
        <div className="flex items-center justify-between text-[10px] text-zinc-400">
          <span className="line-clamp-1">
            {station.state || station.country || "Tamil"}
          </span>
          {station.bitrate ? (
            <span className="ml-2 rounded-full border border-white/10 px-1.5 py-0.5 text-[10px]">
              {station.bitrate}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}

export function StationGrid({ stations }: StationGridProps) {
  const { playStation, currentStation, isPlaying } = usePlayer();

  if (stations.length === 0) {
    return (
      <div className="flex h-full flex-1 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5/5 text-sm text-zinc-400">
        No stations found right now. Please try again later.
      </div>
    );
  }

  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
      {stations.map((station) => {
        const isCurrent = currentStation?.stationuuid === station.stationuuid;

        return (
          <StationTile
            key={station.stationuuid}
            station={station}
            isCurrent={isCurrent}
            isPlaying={isPlaying}
            onPlay={() => playStation(station)}
          />
        );
      })}
    </div>
  );
}

