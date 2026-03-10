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
}

export async function getTamilStations(
  options: FetchStationsOptions = {},
): Promise<Station[]> {
  const url = new URL(RADIO_BROWSER_ENDPOINT);

  const limit = options.limit ?? 32;
  const offset = options.offset ?? 0;

  url.searchParams.set("language", "tamil");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("offset", String(offset));
  url.searchParams.set("order", "clickcount");
  url.searchParams.set("hidebroken", "true");
  url.searchParams.set("reverse", "true");

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "isai-flow/1.0 (https://example.com)",
    },
    signal: options.signal,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch stations: ${response.statusText}`);
  }

  const data = (await response.json()) as Station[];

  // Allow both HTTPS and HTTP streams and rely on Radio Browser's
  // own `hidebroken=true` filter. We only de-duplicate by UUID.
  const uniqueById = new Map<string, Station>();
  for (const station of data) {
    if (!uniqueById.has(station.stationuuid)) {
      uniqueById.set(station.stationuuid, station);
    }
  }

  return Array.from(uniqueById.values());
}

