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
}

export async function getTamilStations(
  options: FetchStationsOptions = {},
): Promise<Station[]> {
  const url = new URL(RADIO_BROWSER_ENDPOINT);

  url.searchParams.set("language", "tamil");
  url.searchParams.set("limit", "100");
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

  const httpsStations = data.filter(
    (station) =>
      station.ssl_error === 0 &&
      typeof station.url_resolved === "string" &&
      station.url_resolved.toLowerCase().startsWith("https://"),
  );

  const uniqueById = new Map<string, Station>();
  for (const station of httpsStations) {
    if (!uniqueById.has(station.stationuuid)) {
      uniqueById.set(station.stationuuid, station);
    }
  }

  return Array.from(uniqueById.values());
}

