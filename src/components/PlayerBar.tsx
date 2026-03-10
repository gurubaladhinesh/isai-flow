"use client";

import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { usePlayer } from "@/src/context/PlayerContext";

export function PlayerBar() {
  const { currentStation, isPlaying, togglePlay, volume, setVolume } =
    usePlayer();

  const handleChangeVolume = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setVolume(value / 100);
  };

  const handleToggleMute = () => {
    if (volume === 0) {
      setVolume(0.7);
    } else {
      setVolume(0);
    }
  };

  return (
    <div className="pointer-events-auto fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/60 px-3 py-2 text-xs text-white shadow-[0_-12px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:px-4 sm:py-3">
      <div className="flex w-full items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={togglePlay}
          disabled={!currentStation}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/40 transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4 pl-0.5" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="truncate text-[13px] font-semibold sm:text-sm">
              {currentStation?.name ?? "Select a station to start listening"}
            </div>
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-[11px] text-zinc-400">
            <span className="truncate">
              {currentStation?.state ||
                currentStation?.country ||
                (currentStation ? "Tamil Radio" : "Browse Tamil stations above")}
            </span>
            {currentStation?.bitrate ? (
              <span className="hidden rounded-full border border-white/10 px-1.5 py-0.5 text-[10px] text-zinc-300 sm:inline-block">
                {currentStation.bitrate} kbps
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleToggleMute}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-100 transition hover:border-violet-400/80 hover:bg-violet-500/20"
          >
            {volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(volume * 100)}
            onChange={handleChangeVolume}
            className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-zinc-700 outline-none sm:w-32"
          />
        </div>
      </div>
    </div>
  );
}

