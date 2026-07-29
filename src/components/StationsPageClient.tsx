"use client";

import {
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
import { StationGridSkeleton } from "@/src/components/StationGridSkeleton";
import { usePlayer } from "@/src/context/PlayerContext";
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
      className="sticky top-0 z-20 -mx-1 scroll-mt-4 border-b border-transparent bg-[rgba(11,18,16,0.82)] px-1 py-2.5 backdrop-blur-xl supports-[backdrop-filter]:bg-[rgba(11,18,16,0.72)]"
    >
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <p className="text-sm text-[var(--muted)]">{description}</p>
    </div>
  );
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
  const catalogRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);
  const restoredRef = useRef(false);
  const stateRef = useRef({
    stations: initialStations,
    offset: initialOffset,
    hasMore: true,
    query: "",
  });
  const searchParams = useSearchParams();
  const { favoriteStations, recentStations } = usePlayer();

  stateRef.current = { stations, offset, hasMore, query };

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

  // Restore catalog + scroll position when returning from a station page.
  // Prefer explicit hash anchors over restored scroll when present.
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
    setHasMore(saved.hasMore);
    if (saved.query) setQuery(saved.query);

    const targetY = saved.scrollY;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        smoothScrollTo(targetY, "auto");
      });
    });
  }, []);

  // Persist scroll state while browsing and before leaving the page.
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden") persistScrollState();
    };
    const onPageHide = () => persistScrollState();

    window.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);

    const interval = window.setInterval(persistScrollState, 1500);

    return () => {
      persistScrollState();
      window.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
      window.clearInterval(interval);
    };
  }, [persistScrollState]);

  // Bring results into view when searching.
  useEffect(() => {
    if (!deferredQuery) return;
    const catalog = catalogRef.current;
    if (!catalog) return;
    const frame = requestAnimationFrame(() => {
      smoothScrollIntoView(catalog, "start");
    });
    return () => cancelAnimationFrame(frame);
  }, [deferredQuery]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
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
      loadingRef.current = false;
      setIsLoading(false);
    }
  }, [hasMore, offset, pageSize]);

  useEffect(() => {
    if (!hasMore || deferredQuery) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loadingRef.current) {
          void loadMore();
        }
      },
      {
        root: null,
        // Prefetch ~1–1.5 viewports ahead for continuous scrolling.
        rootMargin: "1200px 0px",
        threshold: 0,
      },
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, [hasMore, deferredQuery, loadMore, stations.length]);

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
          <StationGrid stations={favoriteStations} />
        </section>
      ) : null}

      {!deferredQuery && recentStations.length > 0 ? (
        <section className="space-y-3">
          <SectionHeading
            id="recent"
            title="Recently played"
            description="Pick up where you left off."
          />
          <StationGrid stations={recentStations} />
        </section>
      ) : null}

      {!deferredQuery ? (
        <section className="space-y-3">
          <SectionHeading
            id="popular"
            title="Popular now"
            description="Most listened Tamil streams from the catalogue."
          />
          <StationGrid stations={popularStations} />
        </section>
      ) : null}

      <section className="space-y-3">
        <SectionHeading
          id="all-stations"
          title={deferredQuery ? "Search results" : "All stations"}
          description={
            deferredQuery
              ? `${filteredStations.length} match${filteredStations.length === 1 ? "" : "es"} for “${query.trim()}”`
              : "Handpicked Tamil radio streams from around the world."
          }
        />
        <StationGrid stations={filteredStations} />
      </section>

      {!deferredQuery ? (
        <div ref={sentinelRef} className="min-h-10 w-full space-y-4 pb-2">
          {isLoading ? <StationGridSkeleton count={8} /> : null}
          {loadError ? (
            <button
              type="button"
              onClick={() => void loadMore()}
              className="mx-auto flex text-[11px] text-[var(--warm)] underline-offset-2 hover:underline"
            >
              {loadError}
            </button>
          ) : null}
          {!hasMore && stations.length > 0 && !loadError ? (
            <div className="flex items-center justify-center text-[11px] text-[var(--muted)]">
              You’ve reached the end of the list.
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
