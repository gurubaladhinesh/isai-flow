"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Station } from "@/src/lib/radio-api";

interface PlayerContextValue {
  currentStation: Station | null;
  isPlaying: boolean;
  volume: number;
  recentStations: Station[];
  playStation: (station: Station) => void;
  togglePlay: () => void;
  setVolume: (value: number) => void;
}

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

interface PlayerProviderProps {
  children: React.ReactNode;
}

export function PlayerProvider({ children }: PlayerProviderProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(false);
  const isSwitchingRef = useRef(false);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.8);
  const [recentStations, setRecentStations] = useState<Station[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
  }, [volume]);

  // Keep refs in sync
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const currentStationRef = useRef<Station | null>(null);
  useEffect(() => {
    currentStationRef.current = currentStation;
  }, [currentStation]);

  useEffect(() => {
    if (!errorMessage) return;
    const timeoutId = window.setTimeout(() => {
      setErrorMessage(null);
    }, 4000);
    return () => window.clearTimeout(timeoutId);
  }, [errorMessage]);

  const playStation = useCallback((station: Station) => {
    // Mark that we're switching to a new station
    isSwitchingRef.current = true;

    // Cancel any pending play promise
    if (playPromiseRef.current) {
      // The previous play() will be aborted, which is expected
      playPromiseRef.current = null;
    }

    setCurrentStation(station);
    setIsPlaying(true);
    setRecentStations((prev) => {
      const existingIndex = prev.findIndex(
        (s) => s.stationuuid === station.stationuuid,
      );
      const withoutExisting =
        existingIndex >= 0
          ? [...prev.slice(0, existingIndex), ...prev.slice(existingIndex + 1)]
          : prev;

      return [station, ...withoutExisting].slice(0, 10);
    });
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const setVolume = useCallback((value: number) => {
    const clamped = Math.min(1, Math.max(0, value));
    setVolumeState(clamped);
  }, []);

  // Keyboard shortcut: spacebar to toggle play/pause
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (event.code === "Space" && currentStation) {
        event.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStation, togglePlay]);

  // Handle audio playback - use refs to avoid race conditions
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentStation) {
      const src = currentStation.url_resolved || currentStation.url;
      if (audio.src !== src) {
        // Mark that we're switching stations
        isSwitchingRef.current = true;
        audio.src = src;
      }
    }

    const playIfPossible = async () => {
      if (!audio) return;

      // Use refs to get the latest values
      const station = currentStationRef.current;
      const shouldPlay = isPlayingRef.current;

      if (station && shouldPlay) {
        try {
          await audio.play();
        } catch (error) {
          // Ignore AbortError - this happens when switching stations quickly
          // The previous play() was cancelled by a new load request or pause()
          if (error instanceof DOMException && error.name === 'AbortError') {
            // This is expected when switching stations, no need to show error
            return;
          }
          console.error("Failed to play audio", error);
          setIsPlaying(false);
          setErrorMessage("Unable to start playback. Try another station.");
        }
      } else {
        audio.pause();
      }

      // Clear switching flag after a short delay
      setTimeout(() => {
        isSwitchingRef.current = false;
      }, 100);
    };

    void playIfPossible();
  }, [currentStation, isPlaying]);

  const handleAudioError = useCallback(() => {
    setIsPlaying(false);
    setErrorMessage("Stream failed. This station may be offline.");
  }, []);

  const value: PlayerContextValue = useMemo(
    () => ({
      currentStation,
      isPlaying,
      volume,
      recentStations,
      playStation,
      togglePlay,
      setVolume,
    }),
    [currentStation, isPlaying, volume, recentStations, playStation, togglePlay, setVolume],
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        className="hidden"
        onError={handleAudioError}
        autoPlay
      />
      {errorMessage ? (
        <div className="pointer-events-none fixed right-4 top-4 z-[60] max-w-sm rounded-xl border border-red-500/40 bg-black/80 px-4 py-3 text-sm text-red-100 shadow-lg backdrop-blur-md">
          {errorMessage}
        </div>
      ) : null}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return ctx;
}

