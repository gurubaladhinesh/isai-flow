"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search, Languages, Radio } from "lucide-react";
import { useLanguage } from "@/src/context/LanguageContext";
import { useDynamicLanguages } from "@/src/context/DynamicLanguagesContext";
import type { Language } from "@/src/lib/radio-api";

export function LanguageSwitcher() {
  const { currentLanguage, languages, isLoading, isInitialized, setLanguage, getDisplayName } = useLanguage();
  const { languagesFromStations } = useDynamicLanguages();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Combine static languages with dynamic languages from stations
  const combinedLanguages = [...languages, ...languagesFromStations.map(name => ({ name, stationcount: 0 }))]
    .filter((lang, index, self) =>
      index === self.findIndex(l => l.name === lang.name)
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const filtered = combinedLanguages.filter((lang) => {
    const q = search.toLowerCase();
    const displayName = getDisplayName(lang.name);
    return (
      displayName.toLowerCase().includes(q) ||
      lang.name.toLowerCase().includes(q)
    );
  });

  const handleSelect = (languageCode: string | null) => {
    setLanguage(languageCode);
    setIsOpen(false);
    setSearch("");
  };

  const showAllStations = currentLanguage === null;

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-medium text-white backdrop-blur-xl transition hover:border-violet-500/50 hover:bg-white/5 sm:px-4"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <Languages className="h-3.5 w-3.5 flex-shrink-0 text-violet-400" />
        <span className="hidden sm:inline">
          {isLoading ? "Loading..." : isInitialized ? (currentLanguage ? getDisplayName(currentLanguage) : "All Languages") : "Select Language"}
        </span>
        <ChevronDown className={`h-3 w-3 text-zinc-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-white/10 bg-black/90 shadow-2xl shadow-black/80 backdrop-blur-xl">
          <div className="sticky top-0 border-b border-white/5 bg-black/50 p-2">
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
              <Search className="h-3.5 w-3.5 flex-shrink-0 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search languages..."
                className="flex-1 bg-transparent text-xs text-white placeholder-zinc-500 outline-none"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto p-1">
            {/* Show "All Languages" option */}
            <button
              type="button"
              onClick={() => handleSelect(null)}
              className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-xs transition ${
                showAllStations
                  ? "bg-violet-500/20 text-violet-300"
                  : "text-zinc-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <Radio className={`h-3 w-3 flex-shrink-0 ${showAllStations ? "text-violet-400" : "text-zinc-600"}`} />
                <span className="font-medium">All Languages</span>
                {showAllStations && (
                  <span className="rounded-full bg-violet-500/30 px-1.5 py-0.5 text-[10px] text-violet-300">
                    Active
                  </span>
                )}
              </span>
            </button>

            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-zinc-500">
                No languages found.
              </div>
            ) : (
              filtered.map((language) => {
                const isActive = currentLanguage === language.name;
                return (
                  <button
                    key={language.name}
                    type="button"
                    onClick={() => handleSelect(language.name)}
                    className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-xs transition ${
                      isActive
                        ? "bg-violet-500/20 text-violet-300"
                        : "text-zinc-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Radio className={`h-3 w-3 flex-shrink-0 ${isActive ? "text-violet-400" : "text-zinc-600"}`} />
                      <span className="font-medium">{getDisplayName(language.name)}</span>
                      {isActive && (
                        <span className="rounded-full bg-violet-500/30 px-1.5 py-0.5 text-[10px] text-violet-300">
                          Active
                        </span>
                      )}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}