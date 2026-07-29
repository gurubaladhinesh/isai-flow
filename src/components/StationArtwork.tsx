"use client";

import Image from "next/image";
import { useState } from "react";

export const STATION_DEFAULT_ARTWORK = "/station-default.svg";

export function getStationArtworkUrl(favicon?: string | null): string {
  const candidate = favicon?.trim();
  return candidate || STATION_DEFAULT_ARTWORK;
}

interface StationArtworkProps {
  src?: string | null;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}

export function StationArtwork({
  src,
  alt,
  sizes,
  className = "object-cover",
  priority,
}: StationArtworkProps) {
  const [failed, setFailed] = useState(false);
  const imageSrc = failed ? STATION_DEFAULT_ARTWORK : getStationArtworkUrl(src);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      priority={priority}
      onError={() => setFailed(true)}
    />
  );
}

interface StationArtworkThumbProps {
  src?: string | null;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
  decoding?: "async" | "sync" | "auto";
}

export function StationArtworkThumb({
  src,
  alt,
  className = "h-full w-full object-cover",
  loading = "lazy",
  decoding = "async",
}: StationArtworkThumbProps) {
  const [failed, setFailed] = useState(false);
  const imageSrc = failed ? STATION_DEFAULT_ARTWORK : getStationArtworkUrl(src);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      onError={(event) => {
        const target = event.currentTarget;
        if (target.src.endsWith(STATION_DEFAULT_ARTWORK)) return;
        setFailed(true);
        target.src = STATION_DEFAULT_ARTWORK;
      }}
    />
  );
}
