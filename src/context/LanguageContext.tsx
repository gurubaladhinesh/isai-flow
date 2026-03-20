"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Language } from "@/src/lib/radio-api";
import {
  getLanguages,
} from "@/src/lib/radio-api";

interface LanguageContextValue {
  currentLanguage: string | null;
  languages: Language[];
  isLoading: boolean;
  isInitialized: boolean;
  setLanguage: (language: string | null) => void;
  getDisplayName: (code: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = "isaiflow_language";

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguageState] = useState<string | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const langs = await getLanguages();
        setLanguages(langs);
      } catch (error) {
        console.error("Failed to load languages", error);
      } finally {
        setIsLoading(false);
      }
    };
    void loadLanguages();
  }, []);

  useEffect(() => {
    const initLanguage = () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (stored) {
          setCurrentLanguageState(stored);
        }
      }
      setIsInitialized(true);
    };

    if (!isLoading) {
      initLanguage();
    }
  }, [isLoading]);

  const setLanguage = useCallback((language: string | null) => {
    setCurrentLanguageState(language);
    if (typeof window !== "undefined") {
      if (language) {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      } else {
        localStorage.removeItem(LANGUAGE_STORAGE_KEY);
      }
    }
  }, []);

  const getDisplayName = useCallback((code: string) => {
    const found = languages.find(
      (lang) => lang.name.toLowerCase() === code.toLowerCase(),
    );
    if (found) return found.name;

    // Capitalize first letter
    return code.charAt(0).toUpperCase() + code.slice(1);
  }, [languages]);

  const value = useMemo(
    () => ({
      currentLanguage,
      languages,
      isLoading,
      isInitialized,
      setLanguage,
      getDisplayName,
    }),
    [currentLanguage, languages, isLoading, isInitialized, setLanguage, getDisplayName],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}