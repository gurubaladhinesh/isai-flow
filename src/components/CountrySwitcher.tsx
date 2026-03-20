"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search, Globe, Radio } from "lucide-react";
import { useCountry } from "@/src/context/CountryContext";
import type { Country } from "@/src/lib/radio-api";
import { getCountryDisplayName } from "@/src/lib/radio-api";

export function CountrySwitcher() {
  const { currentCountry, countries, isLoading, isInitialized, setCountry, getDisplayName } = useCountry();
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

  const filtered = countries.filter((c: Country) => {
    const q = search.toLowerCase();
    const displayName = getCountryDisplayName(c.name);
    return (
      displayName.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      String(c.stationcount).includes(q)
    );
  });

  const handleSelect = (countryCode: string) => {
    setCountry(countryCode);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-medium text-white backdrop-blur-xl transition hover:border-violet-500/50 hover:bg-white/5 sm:px-4"
        aria-label="Select country"
        aria-expanded={isOpen}
      >
        <Globe className="h-3.5 w-3.5 flex-shrink-0 text-violet-400" />
        <span className="hidden sm:inline">
          {isLoading ? "Loading..." : isInitialized ? getDisplayName(currentCountry) : "Select Country"}
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
                placeholder="Search countries..."
                className="flex-1 bg-transparent text-xs text-white placeholder-zinc-500 outline-none"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto p-1">
            {/* Show "All Countries" option */}
            <button
              type="button"
              onClick={() => handleSelect("")}
              className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-xs transition ${
                currentCountry === ""
                  ? "bg-violet-500/20 text-violet-300"
                  : "text-zinc-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <Radio className={`h-3 w-3 flex-shrink-0 ${currentCountry === "" ? "text-violet-400" : "text-zinc-600"}`} />
                <span className="font-medium">All Countries</span>
                {currentCountry === "" && (
                  <span className="rounded-full bg-violet-500/30 px-1.5 py-0.5 text-[10px] text-violet-300">
                    Active
                  </span>
                )}
              </span>
            </button>

            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-zinc-500">
                No countries found.
              </div>
            ) : (
              filtered.map((country: Country) => {
                const isActive = country.name.toUpperCase() === currentCountry;
                return (
                  <button
                    key={country.name}
                    type="button"
                    onClick={() => handleSelect(country.name)}
                    className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-xs transition ${
                      isActive
                        ? "bg-violet-500/20 text-violet-300"
                        : "text-zinc-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Radio className={`h-3 w-3 flex-shrink-0 ${isActive ? "text-violet-400" : "text-zinc-600"}`} />
                      <span className="font-medium">{getCountryDisplayName(country.name)}</span>
                      {isActive && (
                        <span className="rounded-full bg-violet-500/30 px-1.5 py-0.5 text-[10px] text-violet-300">
                          Active
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {country.stationcount.toLocaleString()} stations
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