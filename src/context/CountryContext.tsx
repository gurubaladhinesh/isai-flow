"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Country } from "@/src/lib/radio-api";
import {
  detectUserCountry,
  getCountries,
  getStoredCountry,
  getCountryDisplayName,
  matchCountryToAvailable,
  setStoredCountry,
} from "@/src/lib/radio-api";

interface CountryContextValue {
  currentCountry: string;
  countries: Country[];
  isLoading: boolean;
  isInitialized: boolean;
  setCountry: (code: string) => void;
  getDisplayName: (code: string) => string;
}

const CountryContext = createContext<CountryContextValue | undefined>(undefined);

interface CountryProviderProps {
  children: React.ReactNode;
}

export function CountryProvider({ children }: CountryProviderProps) {
  const [currentCountry, setCurrentCountryState] = useState("IN");
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const ctrs = await getCountries();
        setCountries(ctrs);
      } catch (error) {
        console.error("Failed to load countries", error);
      } finally {
        setIsLoading(false);
      }
    };
    void loadCountries();
  }, []);

  useEffect(() => {
    const initCountry = async () => {
      const stored = getStoredCountry();
      if (stored) {
        setCurrentCountryState(stored.toUpperCase());
        setIsInitialized(true);
        return;
      }
      const detected = await detectUserCountry();
      const matched = matchCountryToAvailable(detected, countries);
      setCurrentCountryState(matched);
      setIsInitialized(true);
    };
    if (!isLoading && countries.length > 0) {
      void initCountry();
    }
  }, [countries, isLoading]);

  const setCountry = useCallback((code: string) => {
    const upperCode = code.toUpperCase();
    setCurrentCountryState(upperCode);
    if (upperCode === "") {
      // Remove from localStorage when selecting "All Countries"
      if (typeof window !== "undefined") {
        localStorage.removeItem("isaiflow_country");
      }
    } else {
      setStoredCountry(upperCode);
    }
  }, []);

  const getDisplayName = useCallback((code: string) => {
    const found = countries.find(
      (c) => c.name.toUpperCase() === code.toUpperCase(),
    );
    if (found) return getCountryDisplayName(found.name);
    return getCountryDisplayName(code);
  }, [countries]);

  const value = useMemo(
    () => ({
      currentCountry,
      countries,
      isLoading,
      isInitialized,
      setCountry,
      getDisplayName,
    }),
    [currentCountry, countries, isLoading, isInitialized, setCountry, getDisplayName],
  );

  return (
    <CountryContext.Provider value={value}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const ctx = useContext(CountryContext);
  if (!ctx) {
    throw new Error("useCountry must be used within a CountryProvider");
  }
  return ctx;
}
