"use client";

import { useEffect, useRef, useState } from "react";
import type { Station } from "@/src/lib/radio-api";
import { StationGrid } from "@/src/components/StationGrid";

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
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasMore) return;
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
  }, [hasMore, isLoading, sentinelRef.current]);

  const loadMore = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

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
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-1 flex-col gap-3">
      <StationGrid stations={stations} />
      <div ref={sentinelRef} className="h-10 w-full">
        {isLoading && (
          <div className="flex items-center justify-center text-[11px] text-zinc-500">
            Loading more stations…
          </div>
        )}
        {!hasMore && stations.length > 0 && (
          <div className="flex items-center justify-center text-[11px] text-zinc-600">
            You’ve reached the end of the list.
          </div>
        )}
      </div>
    </div>
  );
}

