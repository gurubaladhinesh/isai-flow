"use client";

import Link from "next/link";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { usePlayer } from "@/src/context/PlayerContext";
import { getStationUrl } from "@/src/lib/slug";
import { useState } from "react";

function Equalizer({ active }: { active: boolean }) {
  return (
    <div
      className="flex h-8 items-end gap-0.5"
      aria-hidden
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={`w-1 origin-bottom rounded-full bg-[var(--accent-bright)] ${
            active ? "animate-eq" : "scale-y-[0.25] opacity-40"
          }`}
          style={{
            height: "100%",
            animationDelay: active ? `${i * 0.12}s` : undefined,
          }}
        />
      ))}
    </div>
  );
}

export function PlayerBar() {
  const {
    currentStation,
    isPlaying,
    isBuffering,
    togglePlay,
    volume,
    setVolume,
  } = usePlayer();
  const [showMobileVolume, setShowMobileVolume] = useState(false);

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

  const statusLabel = !currentStation
    ? "Ready to listen"
    : isBuffering
      ? "Connecting…"
      : isPlaying
        ? "Live"
        : "Paused";

  const stationHref = currentStation
    ? getStationUrl(currentStation)
    : undefined;

  return (
    <div className="pointer-events-auto fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-[rgba(10,16,14,0.86)] px-4 py-3 text-[var(--text)] shadow-[0_-16px_40px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-[#1a2420] ring-1 ring-white/10">
            {currentStation ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentStation.favicon || "/station-default.svg"}
                alt=""
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/station-default.svg";
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg text-[var(--accent-bright)]">
                இ
              </div>
            )}
          </div>
          <div className="min-w-0">
            {stationHref ? (
              <Link
                href={stationHref}
                className="block truncate font-display text-sm font-semibold tracking-tight hover:text-[var(--accent-bright)] sm:text-base"
              >
                {currentStation?.name}
              </Link>
            ) : (
              <div className="truncate font-display text-sm font-semibold tracking-tight sm:text-base">
                Select a station
              </div>
            )}
            <div className="flex items-center gap-2 truncate text-[11px] text-[var(--muted)] sm:text-xs">
              <span
                className={`inline-flex items-center gap-1 ${
                  isPlaying && !isBuffering
                    ? "text-[var(--accent-bright)]"
                    : ""
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isPlaying && !isBuffering
                      ? "bg-[var(--accent-bright)]"
                      : isBuffering
                        ? "animate-pulse bg-[var(--warm)]"
                        : "bg-[var(--muted)]"
                  }`}
                />
                {statusLabel}
              </span>
              <span className="truncate">
                {currentStation?.state ||
                  currentStation?.country ||
                  "Tamil Internet Radio"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center gap-4">
          <Equalizer active={Boolean(isPlaying && currentStation && !isBuffering)} />

          <button
            type="button"
            onClick={togglePlay}
            disabled={!currentStation}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--text)] text-[#0b1210] transition hover:scale-105 enabled:hover:bg-white disabled:cursor-not-allowed disabled:opacity-25"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 fill-current" />
            ) : (
              <Play className="h-5 w-5 translate-x-0.5 fill-current" />
            )}
          </button>

          <div className="hidden sm:block">
            <Equalizer active={Boolean(isPlaying && currentStation && !isBuffering)} />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <div className="hidden items-center gap-3 sm:flex">
            <button
              type="button"
              onClick={handleToggleMute}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--muted)] transition hover:bg-white/5 hover:text-[var(--text)]"
              aria-label={volume === 0 ? "Unmute" : "Mute"}
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
              aria-label="Volume"
              className="h-1.5 w-28 cursor-pointer appearance-none rounded-full bg-[#24302b] accent-[var(--accent-bright)]"
            />
          </div>

          <div className="relative sm:hidden">
            <button
              type="button"
              onClick={() => setShowMobileVolume((v) => !v)}
              onDoubleClick={handleToggleMute}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--muted)] transition hover:bg-white/5 hover:text-[var(--text)]"
              aria-label="Volume"
            >
              {volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
            {showMobileVolume ? (
              <div className="absolute bottom-12 right-0 rounded-xl border border-[var(--border)] bg-[#121a17] p-3 shadow-xl">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(volume * 100)}
                  onChange={handleChangeVolume}
                  aria-label="Volume"
                  className="h-1.5 w-28 cursor-pointer appearance-none rounded-full bg-[#24302b] accent-[var(--accent-bright)]"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <p className="mx-auto mt-1 hidden max-w-7xl text-center text-[10px] text-[var(--muted)] sm:block">
        Press Space to play or pause
      </p>
    </div>
  );
}
