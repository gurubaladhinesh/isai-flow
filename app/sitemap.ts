import type { MetadataRoute } from "next";
import { getAllTamilStations } from "@/src/lib/radio-api";
import { createSlug } from "@/src/lib/slug";
import { POPULAR_GENRES, POPULAR_LOCATIONS, SITE_URL } from "@/src/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...POPULAR_GENRES.map((genre) => ({
      url: `${SITE_URL}/genre/${genre.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...POPULAR_LOCATIONS.map((location) => ({
      url: `${SITE_URL}/location/${location.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];

  try {
    const stations = await getAllTamilStations();
    const stationUrls = stations.map((station) => ({
      url: `${SITE_URL}/station/${station.stationuuid}-${createSlug(station.name)}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));

    return [...staticPages, ...stationUrls];
  } catch (error) {
    console.error("Failed to load stations for sitemap", error);
    return staticPages;
  }
}
