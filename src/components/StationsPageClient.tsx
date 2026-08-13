"use client";

import {
  startTransition,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import type { Station } from "@/src/lib/radio-api";
import { StationGrid } from "@/src/components/StationGrid";
import { usePlayer } from "@/src/context/PlayerContext";
import { stationMatchesQuery } from "@/src/lib/station-search";
import {
  fetchStationPage,
  mergeStations,
  prefetchStationPage,
  searchStations,
  seedStationPage,
} from "@/src/lib/station-page-cache";
import {
  clearHomeScrollState,
  readHomeScrollState,
  saveHomeScrollState,
  smoothScrollIntoView,
  smoothScrollTo,
} from "@/src/lib/scroll";

interface StationsPageClientProps {
  initialStations: Station[];
  initialOffset: number;
  pageSize?: number;
}

const PREFETCH_ROOT_MARGIN = "300% 0px 300% 0px";
const SKELETON_COUNT = 12;

function SectionHeading({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description: string;
}) {
  return (
    <div
      id={id}
      className="section-heading sticky top-0 z-20 -mx-1 scroll-mt-4 border-b border-[var(--border)]/40 bg-[#0b1210]/95 px-1 py-2.5"
    >
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <p className="text-sm text-[var(--muted)]">{description}</p>
    </div>
  );
}

export function StationsPageClient({
  initialStations,
  initialOffset,
  pageSize = 48,
}: StationsPageClientProps) {
  const [stations, setStations] = useState<Station[]>(initialStations);
  const [offset, setOffset] = useState(initialOffset);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState("");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Station[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const loadTriggerRef = useRef<HTMLDivElement | null>(null);
  const catalogRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);
  const restoredRef = useRef(false);
  const offsetRef = useRef(initialOffset);
  const hasMoreRef = useRef(true);
  const stateRef = useRef({
    stations: initialStations,
    offset: initialOffset,
    hasMore: true,
    query: "",
  });
  const searchParams = useSearchParams();
  const { favoriteStations, recentStations } = usePlayer();

  offsetRef.current = offset;
  hasMoreRef.current = hasMore;
  stateRef.current = { stations, offset, hasMore, query };

  const queuePrefetch = useCallback(
    (fromOffset: number) => {
      if (!hasMoreRef.current) return;
      prefetchStationPage(fromOffset, pageSize);
      prefetchStationPage(fromOffset + pageSize, pageSize);
    },
    [pageSize],
  );

  const persistScrollState = useCallback(() => {
    const current = stateRef.current;
    saveHomeScrollState({
      scrollY: window.scrollY,
      offset: current.offset,
      stations: current.stations,
      hasMore: current.hasMore,
      query: current.query,
    });
  }, []);

  useEffect(() => {
    const initialQuery = searchParams.get("q");
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;

    const hash = window.location.hash.replace(/^#/, "");
    if (hash) {
      requestAnimationFrame(() => {
        const el = document.getElementById(hash);
        if (el) smoothScrollIntoView(el, "start");
      });
      return;
    }

    const saved = readHomeScrollState();
    if (!saved || saved.stations.length === 0) return;

    setStations(saved.stations);
    setOffset(saved.offset);
    offsetRef.current = saved.offset;
    setHasMore(saved.hasMore);
    hasMoreRef.current = saved.hasMore;
    if (saved.query) setQuery(saved.query);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        smoothScrollTo(saved.scrollY, "auto");
      });
    });
  }, []);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden") persistScrollState();
    };
    const onPageHide = () => persistScrollState();

    window.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);

    return () => {
      persistScrollState();
      window.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, [persistScrollState]);

  useEffect(() => {
    if (!deferredQuery) return;
    const catalog = catalogRef.current;
    if (!catalog) return;
    const frame = requestAnimationFrame(() => {
      smoothScrollIntoView(catalog, "start");
    });
    return () => cancelAnimationFrame(frame);
  }, [deferredQuery]);

  const appendStations = useCallback((incoming: Station[]) => {
    startTransition(() => {
      setStations((prev) => mergeStations(prev, incoming));
    });
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;

    loadingRef.current = true;
    setIsLoading(true);
    setLoadError(null);

    const requestOffset = offsetRef.current;

    try {
      const next = await fetchStationPage(requestOffset, pageSize);

      appendStations(next);
      const nextOffset = requestOffset + next.length;
      offsetRef.current = nextOffset;
      setOffset(nextOffset);

      if (next.length === 0) {
        hasMoreRef.current = false;
        setHasMore(false);
      } else {
        queuePrefetch(nextOffset);
      }
    } catch (error) {
      console.error(error);
      setLoadError("Couldn’t load more stations. Scroll again to retry.");
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  }, [appendStations, pageSize, queuePrefetch]);

  const handleLoadTrigger = useCallback((node: HTMLDivElement | null) => {
    loadTriggerRef.current = node;
  }, []);

  // Seed client cache with SSR data and warm upcoming pages immediately.
  useEffect(() => {
    seedStationPage(0, pageSize, initialStations);
    queuePrefetch(initialOffset);
  }, [initialOffset, initialStations, pageSize, queuePrefetch]);

  useEffect(() => {
    if (!hasMore || deferredQuery) return;
    const trigger = loadTriggerRef.current;
    if (!trigger) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loadingRef.current) {
          void loadMore();
        }
      },
      {
        root: null,
        rootMargin: PREFETCH_ROOT_MARGIN,
        threshold: 0,
      },
    );

    observer.observe(trigger);
    return () => observer.disconnect();
  }, [hasMore, deferredQuery, loadMore, stations.length]);

  useEffect(() => {
    if (!deferredQuery) {
      setSearchResults(null);
      setIsSearching(false);
      setSearchError(null);
      return;
    }

    const controller = new AbortController();
    setIsSearching(true);
    setSearchError(null);
    setSearchResults(null);

    void (async () => {
      try {
        const matches = await searchStations(deferredQuery, controller.signal);
        setSearchResults(matches);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error(error);
        setSearchError("Couldn’t search the full catalogue. Showing loaded stations.");
        setSearchResults(null);
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    })();

    return () => controller.abort();
  }, [deferredQuery]);

  const filteredStations = useMemo(() => {
    if (!deferredQuery) return stations;
    if (searchResults) return searchResults;
    return stations.filter((station) =>
      stationMatchesQuery(station, deferredQuery),
    );
  }, [stations, deferredQuery, searchResults]);

  const popularStations = useMemo(
    () => [...stations].sort((a, b) => b.clickcount - a.clickcount).slice(0, 8),
    [stations],
  );

  const popularIds = useMemo(
    () => new Set(popularStations.map((station) => station.stationuuid)),
    [popularStations],
  );

  const catalogStations = useMemo(() => {
    if (deferredQuery) return filteredStations;
    return stations.filter((station) => !popularIds.has(station.stationuuid));
  }, [deferredQuery, filteredStations, popularIds, stations]);

  const loadTriggerIndex = Math.max(0, catalogStations.length - 12);

  const handleClearSearch = () => {
    setQuery("");
    clearHomeScrollState();
  };

  return (
    <div ref={catalogRef} className="flex h-full flex-1 flex-col gap-8">
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
            onClick={handleClearSearch}
            className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[var(--muted)] hover:bg-white/5 hover:text-[var(--text)]"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {!deferredQuery && favoriteStations.length > 0 ? (
        <section className="space-y-3">
          <SectionHeading
            id="favorites"
            title="Favorites"
            description="Your saved Tamil stations, ready to resume."
          />
          <StationGrid stations={favoriteStations} priorityCount={4} />
        </section>
      ) : null}

      {!deferredQuery && recentStations.length > 0 ? (
        <section className="space-y-3">
          <SectionHeading
            id="recent"
            title="Recently played"
            description="Pick up where you left off."
          />
          <StationGrid stations={recentStations} priorityCount={4} />
        </section>
      ) : null}

      {!deferredQuery ? (
        <section className="space-y-3">
          <SectionHeading
            id="popular"
            title="Popular now"
            description="Most listened Tamil streams from the catalogue."
          />
          <StationGrid stations={popularStations} priorityCount={8} />
        </section>
      ) : null}

      <section className="space-y-3">
        <SectionHeading
          id="all-stations"
          title={deferredQuery ? "Search results" : "All stations"}
          description={
            deferredQuery
              ? isSearching
                ? `Searching all stations for “${query.trim()}”…`
                : `${filteredStations.length} match${filteredStations.length === 1 ? "" : "es"} for “${query.trim()}”`
              : "Handpicked Tamil radio streams from around the world."
          }
        />
        <StationGrid
          stations={catalogStations}
          loadingCount={
            (!deferredQuery && isLoading) ||
            (deferredQuery && isSearching && catalogStations.length === 0)
              ? SKELETON_COUNT
              : 0
          }
          priorityCount={8}
          loadTriggerIndex={
            !deferredQuery && catalogStations.length > 0
              ? loadTriggerIndex
              : undefined
          }
          onLoadTrigger={!deferredQuery ? handleLoadTrigger : undefined}
        />
      </section>

      {deferredQuery && searchError ? (
        <p className="mx-auto text-center text-[11px] text-[var(--warm)]">
          {searchError}
        </p>
      ) : null}

      {!deferredQuery && loadError ? (
        <button
          type="button"
          onClick={() => void loadMore()}
          className="mx-auto flex text-[11px] text-[var(--warm)] underline-offset-2 hover:underline"
        >
          {loadError}
        </button>
      ) : null}

      {!deferredQuery && !hasMore && stations.length > 0 && !loadError ? (
        <div className="flex items-center justify-center pb-2 text-[11px] text-[var(--muted)]">
          You’ve reached the end of the list.
        </div>
      ) : null}
    </div>
  );
}
