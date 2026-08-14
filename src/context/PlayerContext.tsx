"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { Station } from "@/src/lib/radio-api";

interface PlayerContextValue {
  currentStation: Station | null;
  isPlaying: boolean;
  isBuffering: boolean;
  volume: number;
  recentStations: Station[];
  favoriteStations: Station[];
  errorMessage: string | null;
  playStation: (station: Station) => void;
  togglePlay: () => void;
  setVolume: (value: number) => void;
  toggleFavorite: (station: Station) => void;
  isFavorite: (stationId: string) => boolean;
}

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

const RECENT_KEY = "isai-flow-recent";
const FAVORITES_KEY = "isai-flow-favorites";
const VOLUME_KEY = "isai-flow-volume";

const storageListeners = new Set<() => void>();

function subscribeStorage(onStoreChange: () => void) {
  storageListeners.add(onStoreChange);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStoreChange);
  }
  return () => {
    storageListeners.delete(onStoreChange);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStoreChange);
    }
  };
}

function emitStorage() {
  storageListeners.forEach((listener) => listener());
}

function readStations(key: string, limit: number): Station[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Station[];
    return Array.isArray(parsed) ? parsed.slice(0, limit) : [];
  } catch {
    return [];
  }
}

function writeStations(key: string, stations: Station[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(stations));
    emitStorage();
  } catch {
    // ignore quota / private mode
  }
}

function readVolume(): number {
  if (typeof window === "undefined") return 0.8;
  try {
    const raw = window.localStorage.getItem(VOLUME_KEY);
    if (raw == null) return 0.8;
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) return 0.8;
    return Math.min(1, Math.max(0, parsed));
  } catch {
    return 0.8;
  }
}

function writeVolume(value: number) {
  try {
    window.localStorage.setItem(VOLUME_KEY, String(value));
    emitStorage();
  } catch {
    // ignore
  }
}

interface PlayerProviderProps {
  children: React.ReactNode;
}

export function PlayerProvider({ children }: PlayerProviderProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(false);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recentJson = useSyncExternalStore(
    subscribeStorage,
    () => JSON.stringify(readStations(RECENT_KEY, 10)),
    () => "[]",
  );
  const favoritesJson = useSyncExternalStore(
    subscribeStorage,
    () => JSON.stringify(readStations(FAVORITES_KEY, 40)),
    () => "[]",
  );
  const volumeJson = useSyncExternalStore(
    subscribeStorage,
    () => String(readVolume()),
    () => "0.8",
  );

  const recentStations = useMemo(
    () => JSON.parse(recentJson) as Station[],
    [recentJson],
  );
  const favoriteStations = useMemo(
    () => JSON.parse(favoritesJson) as Station[],
    [favoritesJson],
  );
  const volume = Number(volumeJson);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  // Sync UI with OS media keys (e.g. Mac play/pause) and actual audio state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

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
    if (playPromiseRef.current) {
      playPromiseRef.current = null;
    }

    setCurrentStation(station);
    setIsPlaying(true);
    setIsBuffering(true);
    setErrorMessage(null);

    const withoutExisting = recentStations.filter(
      (s) => s.stationuuid !== station.stationuuid,
    );
    writeStations(RECENT_KEY, [station, ...withoutExisting].slice(0, 10));
  }, [recentStations]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const setVolume = useCallback((value: number) => {
    writeVolume(Math.min(1, Math.max(0, value)));
  }, []);

  const toggleFavorite = useCallback(
    (station: Station) => {
      const exists = favoriteStations.some(
        (s) => s.stationuuid === station.stationuuid,
      );
      if (exists) {
        writeStations(
          FAVORITES_KEY,
          favoriteStations.filter((s) => s.stationuuid !== station.stationuuid),
        );
      } else {
        writeStations(
          FAVORITES_KEY,
          [station, ...favoriteStations].slice(0, 40),
        );
      }
    },
    [favoriteStations],
  );

  const isFavorite = useCallback(
    (stationId: string) =>
      favoriteStations.some((s) => s.stationuuid === stationId),
    [favoriteStations],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target instanceof HTMLElement && event.target.isContentEditable)
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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentStation) {
      const src = currentStation.url_resolved || currentStation.url;
      if (audio.src !== src) {
        audio.src = src;
      }
    }

    const playIfPossible = async () => {
      if (!audio) return;

      const station = currentStationRef.current;
      const shouldPlay = isPlayingRef.current;

      if (station && shouldPlay) {
        try {
          await audio.play();
          setIsBuffering(false);
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }
          console.error("Failed to play audio", error);
          setIsPlaying(false);
          setIsBuffering(false);
          setErrorMessage("Unable to start playback. Try another station.");
        }
      } else {
        audio.pause();
        setIsBuffering(false);
      }
    };

    void playIfPossible();
  }, [currentStation, isPlaying]);

  const handleAudioError = useCallback(() => {
    setIsPlaying(false);
    setIsBuffering(false);
    setErrorMessage("Stream failed. This station may be offline.");
  }, []);

  const value: PlayerContextValue = useMemo(
    () => ({
      currentStation,
      isPlaying,
      isBuffering,
      volume,
      recentStations,
      favoriteStations,
      errorMessage,
      playStation,
      togglePlay,
      setVolume,
      toggleFavorite,
      isFavorite,
    }),
    [
      currentStation,
      isPlaying,
      isBuffering,
      volume,
      recentStations,
      favoriteStations,
      errorMessage,
      playStation,
      togglePlay,
      setVolume,
      toggleFavorite,
      isFavorite,
    ],
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        className="hidden"
        onError={handleAudioError}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        autoPlay
      />
      {errorMessage ? (
        <div
          role="alert"
          className="pointer-events-none fixed right-4 top-4 z-[60] max-w-sm rounded-xl border border-[var(--danger)]/40 bg-[#1a1210]/95 px-4 py-3 text-sm text-[#f5d0c8] shadow-lg backdrop-blur-md"
        >
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
