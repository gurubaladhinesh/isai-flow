"use client";

import { useEffect, useRef, useState } from "react";
import type { Station } from "@/src/lib/radio-api";
import { StationGrid } from "@/src/components/StationGrid";
import { useCountry } from "@/src/context/CountryContext";
import { useLanguage } from "@/src/context/LanguageContext";
import { useDynamicLanguages } from "@/src/context/DynamicLanguagesContext";

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
  const { currentCountry } = useCountry();
  const { currentLanguage } = useLanguage();
  const { updateLanguagesFromStations } = useDynamicLanguages();
  const [stations, setStations] = useState<Station[]>(initialStations);
  const [offset, setOffset] = useState(initialOffset);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const countryRef = useRef(currentCountry);
  const languageRef = useRef(currentLanguage);
  const isInitialMount = useRef(true);

  // Update refs when context values change
  useEffect(() => {
    countryRef.current = currentCountry;
  }, [currentCountry]);

  useEffect(() => {
    languageRef.current = currentLanguage;
  }, [currentLanguage]);

  // Update dynamic languages when stations change
  useEffect(() => {
    updateLanguagesFromStations(stations);
  }, [stations, updateLanguagesFromStations]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setStations([]);
    setOffset(0);
    setHasMore(true);
    setIsLoading(false);
  }, [currentCountry, currentLanguage]);

  useEffect(() => {
    if (isInitialMount.current) return;

    if (stations.length === 0 && !isLoading && hasMore) {
      void loadMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCountry, currentLanguage, stations.length, hasMore]);

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
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, isLoading, currentCountry, currentLanguage]);

  const loadMore = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        offset: String(offset),
        limit: String(pageSize),
      });

      // Only add country parameter if it's not empty
      if (countryRef.current !== "") {
        params.set("country", countryRef.current);
      }

      if (languageRef.current) {
        params.set("language", languageRef.current);
      }

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
            Loading more stations&hellip;
          </div>
        )}
        {!hasMore && stations.length > 0 && (
          <div className="flex items-center justify-center text-[11px] text-zinc-600">
            You&apos;ve reached the end of the list.
          </div>
        )}
      </div>
    </div>
  );
}
