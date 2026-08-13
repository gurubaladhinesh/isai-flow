import type { MetadataRoute } from "next";
import { getAllTamilStations } from "@/src/lib/radio-api";
import { createSlug } from "@/src/lib/slug";
import { getAllBlogSlugs } from "@/src/lib/blog";
import { POPULAR_GENRES, POPULAR_LOCATIONS, SITE_URL } from "@/src/lib/site";
import {
  DEFAULT_LANGUAGE_SLUG,
  LIVE_LANGUAGES,
} from "@/src/lib/languages";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...LIVE_LANGUAGES.filter(
      (language) => language.slug !== DEFAULT_LANGUAGE_SLUG,
    ).map((language) => ({
      url: `${SITE_URL}/listen/${language.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
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
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...getAllBlogSlugs().map((slug) => ({
      url: `${SITE_URL}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
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
