"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Station } from "@/src/lib/radio-api";

const STORAGE_KEY = "isai-flow-favorites";

interface FavoritesContextValue {
  favoriteStations: Station[];
  isFavorite: (stationuuid: string) => boolean;
  toggleFavorite: (station: Station) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined,
);

function loadFromStorage(): Station[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Station[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToStorage(stations: Station[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stations));
  } catch {
    // ignore
  }
}

interface FavoritesProviderProps {
  children: React.ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favoriteStations, setFavoriteStations] = useState<Station[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFavoriteStations(loadFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveToStorage(favoriteStations);
  }, [hydrated, favoriteStations]);

  const isFavorite = useCallback(
    (stationuuid: string) =>
      favoriteStations.some((s) => s.stationuuid === stationuuid),
    [favoriteStations],
  );

  const toggleFavorite = useCallback((station: Station) => {
    setFavoriteStations((prev) => {
      const exists = prev.some((s) => s.stationuuid === station.stationuuid);
      if (exists) {
        return prev.filter((s) => s.stationuuid !== station.stationuuid);
      }
      return [station, ...prev];
    });
  }, []);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favoriteStations,
      isFavorite,
      toggleFavorite,
    }),
    [favoriteStations, isFavorite, toggleFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return ctx;
}
