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
    <div className="pointer-events-auto fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/40 px-4 py-3 text-white shadow-[0_-12px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all duration-500 sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Left: Station Info */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-zinc-800 ring-1 ring-white/10 sm:h-12 sm:w-12">
            {currentStation ? (
              <img
                src={currentStation.favicon || "/station-default.svg"}
                alt={currentStation.name}
                className="h-full w-full object-cover transition duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/station-default.svg";
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-zinc-900/50">
                <div className="h-4 w-4 rounded-full border border-white/10 animate-pulse bg-white/5" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold tracking-tight sm:text-base">
              {currentStation?.name ?? "Select a station"}
            </div>
            <div className="flex items-center gap-2 truncate text-[11px] text-zinc-400 sm:text-xs">
              <span className="truncate">
                {currentStation?.state ||
                  currentStation?.country ||
                  "Tamil Internet Radio"}
              </span>
              {currentStation?.bitrate && (
                <span className="hidden rounded-full border border-white/5 bg-white/5 px-1.5 py-0.5 text-[10px] text-zinc-500 sm:inline-block">
                  {currentStation.bitrate}k
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Playback Controls */}
        <div className="flex flex-1 items-center justify-center">
          <button
            type="button"
            onClick={togglePlay}
            disabled={!currentStation}
            className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-xl ring-4 ring-white/10 transition-all duration-300 hover:scale-110 active:scale-95 enabled:hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-20 sm:h-12 sm:w-12"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 fill-current sm:h-6 sm:w-6" />
            ) : (
              <Play className="h-5 w-5 translate-x-0.5 fill-current sm:h-6 sm:w-6" />
            )}
            <div className="absolute inset-0 -z-10 animate-ping rounded-full bg-white/20 opacity-0 transition group-hover:opacity-100" />
          </button>
        </div>

        {/* Right: Volume Controls */}
        <div className="flex flex-1 items-center justify-end gap-3 sm:gap-4">
          <div className="hidden items-center gap-3 sm:flex">
            <button
              type="button"
              onClick={handleToggleMute}
              className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              {volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
            <div className="group relative flex items-center">
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(volume * 100)}
                onChange={handleChangeVolume}
                className="h-1.5 w-24 cursor-pointer appearance-none rounded-full bg-zinc-800 accent-white transition-all hover:bg-zinc-700 sm:w-28"
              />
            </div>
          </div>
          
          {/* Mobile Mute only */}
          <button
            type="button"
            onClick={handleToggleMute}
            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition hover:bg-white/5 hover:text-white sm:hidden"
          >
            {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

