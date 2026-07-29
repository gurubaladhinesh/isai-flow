"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import type { Station } from "@/src/lib/radio-api";
import { StationGrid } from "@/src/components/StationGrid";
import { usePlayer } from "@/src/context/PlayerContext";

interface StationsPageClientProps {
  initialStations: Station[];
  initialOffset: number;
  pageSize?: number;
}

export function StationsPageClient({
  initialStations,
  initialOffset,
  pageSize = 32,
}: StationsPageClientProps) {
  const [stations, setStations] = useState<Station[]>(initialStations);
  const [offset, setOffset] = useState(initialOffset);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState("");
  const [loadError, setLoadError] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const { favoriteStations, recentStations } = usePlayer();

  useEffect(() => {
    if (!hasMore || deferredQuery) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoading) {
          void loadMore();
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      },
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, isLoading, deferredQuery]);

  const loadMore = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    setLoadError(null);

    try {
      const params = new URLSearchParams({
        offset: String(offset),
        limit: String(pageSize),
      });
      const response = await fetch(`/api/stations?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to load more stations");
      }
      const json = (await response.json()) as { stations: Station[] };
      const next = json.stations ?? [];

      setStations((prev) => {
        const map = new Map<string, Station>();
        for (const s of prev) {
          map.set(s.stationuuid, s);
        }
        for (const s of next) {
          if (!map.has(s.stationuuid)) {
            map.set(s.stationuuid, s);
          }
        }
        return Array.from(map.values());
      });
      setOffset((prev) => prev + next.length);
      if (next.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
      setLoadError("Couldn’t load more stations. Scroll again to retry.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStations = useMemo(() => {
    if (!deferredQuery) return stations;
    return stations.filter((station) => {
      const haystack = [
        station.name,
        station.country,
        station.state,
        station.tags,
        station.language,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(deferredQuery);
    });
  }, [stations, deferredQuery]);

  const popularStations = useMemo(
    () => [...stations].sort((a, b) => b.clickcount - a.clickcount).slice(0, 8),
    [stations],
  );

  return (
    <div className="flex h-full flex-1 flex-col gap-8">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stations, cities, or tags…"
          className="min-h-12 w-full rounded-2xl border border-[var(--border)] bg-white/[0.04] py-3 pl-10 pr-11 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)]/60 focus:bg-white/[0.06]"
          aria-label="Search stations"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[var(--muted)] hover:bg-white/5 hover:text-[var(--text)]"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {!deferredQuery && favoriteStations.length > 0 ? (
        <section className="space-y-3">
          <div>
            <h2 className="font-display text-lg font-semibold">Favorites</h2>
            <p className="text-sm text-[var(--muted)]">
              Your saved Tamil stations, ready to resume.
            </p>
          </div>
          <StationGrid stations={favoriteStations} />
        </section>
      ) : null}

      {!deferredQuery && recentStations.length > 0 ? (
        <section className="space-y-3">
          <div>
            <h2 className="font-display text-lg font-semibold">Recently played</h2>
            <p className="text-sm text-[var(--muted)]">
              Pick up where you left off.
            </p>
          </div>
          <StationGrid stations={recentStations} />
        </section>
      ) : null}

      {!deferredQuery ? (
        <section className="space-y-3">
          <div>
            <h2 className="font-display text-lg font-semibold">Popular now</h2>
            <p className="text-sm text-[var(--muted)]">
              Most listened Tamil streams from the catalogue.
            </p>
          </div>
          <StationGrid stations={popularStations} />
        </section>
      ) : null}

      <section className="space-y-3">
        <div>
          <h2 className="font-display text-lg font-semibold">
            {deferredQuery ? "Search results" : "All stations"}
          </h2>
          <p className="text-sm text-[var(--muted)]">
            {deferredQuery
              ? `${filteredStations.length} match${filteredStations.length === 1 ? "" : "es"} for “${query.trim()}”`
              : "Handpicked Tamil radio streams from around the world."}
          </p>
        </div>
        <StationGrid stations={filteredStations} />
      </section>

      {!deferredQuery ? (
        <div ref={sentinelRef} className="h-10 w-full">
          {isLoading && (
            <div className="flex items-center justify-center text-[11px] text-[var(--muted)]">
              Loading more stations…
            </div>
          )}
          {loadError && (
            <button
              type="button"
              onClick={() => void loadMore()}
              className="mx-auto flex text-[11px] text-[var(--warm)] underline-offset-2 hover:underline"
            >
              {loadError}
            </button>
          )}
          {!hasMore && stations.length > 0 && !loadError && (
            <div className="flex items-center justify-center text-[11px] text-[var(--muted)]">
              You’ve reached the end of the list.
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
