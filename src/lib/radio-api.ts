export interface Station {
  stationuuid: string;
  name: string;
  favicon: string;
  url: string;
  url_resolved: string;
  country: string;
  state: string;
  language: string;
  tags: string;
  bitrate: number;
  clickcount: number;
  ssl_error: number;
}

const RADIO_BROWSER_ENDPOINT =
  "https://de1.api.radio-browser.info/json/stations/search";

interface FetchStationsOptions {
  signal?: AbortSignal;
  offset?: number;
  limit?: number;
  language?: string;
}

const RADIO_BROWSER_HEADERS = {
  "Content-Type": "application/json",
  "User-Agent": "isai-flow/1.0 (https://www.isaiflow.in)",
};

function resolveLanguage(options: FetchStationsOptions): string {
  return options.language?.trim() || "tamil";
}

async function searchStations(
  extraParams: Record<string, string>,
  options: FetchStationsOptions = {},
): Promise<Station[]> {
  const url = new URL(RADIO_BROWSER_ENDPOINT);
  const limit = options.limit ?? 32;
  const offset = options.offset ?? 0;

  url.searchParams.set("language", resolveLanguage(options));
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("offset", String(offset));
  url.searchParams.set("order", "clickcount");
  url.searchParams.set("hidebroken", "true");
  url.searchParams.set("reverse", "true");

  for (const [key, value] of Object.entries(extraParams)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: RADIO_BROWSER_HEADERS,
    signal: options.signal,
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch stations: ${response.statusText}`);
  }

  return (await response.json()) as Station[];
}

function uniqueStations(data: Station[]): Station[] {
  const uniqueById = new Map<string, Station>();
  for (const station of data) {
    if (!uniqueById.has(station.stationuuid)) {
      uniqueById.set(station.stationuuid, station);
    }
  }
  return Array.from(uniqueById.values());
}

export async function getStationsByLanguage(
  language: string,
  options: FetchStationsOptions = {},
): Promise<Station[]> {
  const data = await searchStations({}, { ...options, language });
  return uniqueStations(data);
}

export async function getTamilStations(
  options: FetchStationsOptions = {},
): Promise<Station[]> {
  return getStationsByLanguage("tamil", options);
}

export async function getAllStationsByLanguage(
  language: string,
): Promise<Station[]> {
  const allStations: Station[] = [];
  const pageSize = 100;
  let offset = 0;

  while (true) {
    const batch = await getStationsByLanguage(language, {
      offset,
      limit: pageSize,
    });
    if (batch.length === 0) {
      break;
    }

    allStations.push(...batch);
    offset += batch.length;

    if (batch.length < pageSize) {
      break;
    }
  }

  return allStations;
}

export async function getAllTamilStations(): Promise<Station[]> {
  return getAllStationsByLanguage("tamil");
}

export async function getStationsByTag(
  tag: string,
  options: FetchStationsOptions = {},
): Promise<Station[]> {
  return searchStations({ tag }, options);
}

export async function getStationsByLocation(
  filters: { state?: string; country?: string },
  options: FetchStationsOptions = {},
): Promise<Station[]> {
  const extra: Record<string, string> = {};
  if (filters.state) extra.state = filters.state;
  if (filters.country) extra.country = filters.country;
  return searchStations(extra, options);
}

export async function getRelatedStations(
  station: Station,
  limit = 6,
): Promise<Station[]> {
  const tags = station.tags
    ?.split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const language = station.language?.split(",")[0]?.trim() || "tamil";

  if (tags && tags.length > 0) {
    const related = await getStationsByTag(tags[0], {
      limit: limit + 1,
      language,
    }).catch(() => [] as Station[]);
    const filtered = related.filter(
      (item) => item.stationuuid !== station.stationuuid,
    );
    if (filtered.length > 0) {
      return filtered.slice(0, limit);
    }
  }

  if (station.country) {
    const related = await getStationsByLocation(
      { country: station.country },
      { limit: limit + 1, language },
    ).catch(() => [] as Station[]);
    return related
      .filter((item) => item.stationuuid !== station.stationuuid)
      .slice(0, limit);
  }

  return [];
}

/**
 * Fetches a single station by its UUID
 */
export async function getStationById(uuid: string): Promise<Station | null> {
  const url = `https://de1.api.radio-browser.info/json/stations/byuuid/${uuid}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "isai-flow/1.0 (https://www.isaiflow.in)",
      },
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      console.error(`Failed to fetch station: ${response.statusText}`);
      return null;
    }

    const data = (await response.json()) as Station[];

    if (data.length === 0) {
      return null;
    }

    return data[0];
  } catch (error) {
    console.error("Error fetching station:", error);
    return null;
  }
}
