"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { Station } from "@/src/lib/radio-api";

interface DynamicLanguagesContextValue {
  languagesFromStations: string[];
  updateLanguagesFromStations: (stations: Station[]) => void;
}

const DynamicLanguagesContext = createContext<DynamicLanguagesContextValue | undefined>(undefined);

interface DynamicLanguagesProviderProps {
  children: React.ReactNode;
}

export function DynamicLanguagesProvider({ children }: DynamicLanguagesProviderProps) {
  const [languagesFromStations, setLanguagesFromStations] = useState<string[]>([]);

  const updateLanguagesFromStations = useCallback((stations: Station[]) => {
    const languageSet = new Set<string>();
    stations.forEach(station => {
      if (station.language) {
        // Split languages by comma or semicolon and add each
        const langs = station.language.split(/[,;]/).map(lang => lang.trim()).filter(Boolean);
        langs.forEach(lang => languageSet.add(lang));
      }
    });
    setLanguagesFromStations(Array.from(languageSet).sort());
  }, []);

  const value = {
    languagesFromStations,
    updateLanguagesFromStations,
  };

  return (
    <DynamicLanguagesContext.Provider value={value}>
      {children}
    </DynamicLanguagesContext.Provider>
  );
}

export function useDynamicLanguages() {
  const ctx = useContext(DynamicLanguagesContext);
  if (!ctx) {
    throw new Error("useDynamicLanguages must be used within a DynamicLanguagesProvider");
  }
  return ctx;
}