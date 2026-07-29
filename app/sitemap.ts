import type { MetadataRoute } from 'next'
import { getTamilStations } from '@/src/lib/radio-api'
import { createSlug } from '@/src/lib/slug'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://isaiflow.in'

  const stations = await getTamilStations({ limit: 100 }).catch((error: unknown) => {
    console.error('Failed to load stations for sitemap', error)
    return []
  })

  const stationUrls = stations.map(station => ({
    url: `${baseUrl}/station/${station.stationuuid}-${createSlug(station.name)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...stationUrls,
  ]
}
