export interface Station {
  stationuuid: string;
  name: string;
  favicon: string;
  url: string;
  url_resolved: string;
  country: string;
  country_code: string;
  state: string;
  language: string;
  tags: string;
  bitrate: number;
  codec: string;
  clickcount: number;
  votes: number;
  ssl_error: number;
}

export interface Country {
  name: string;
  stationcount: number;
}

export interface Language {
  iso_639_1: string;
  name: string;
  stationcount: number;
}

export interface UserLocation {
  country_code?: string;
  country_name?: string;
  languages?: string;
  city?: string;
  region?: string;
}

const RADIO_BROWSER_ENDPOINT = "https://de1.api.radio-browser.info/json";
const USER_AGENT = "isai-flow/1.0 (https://isaiflow.in)";

const STORAGE_KEY = "isaiflow_country";
const CACHE_EXPIRY = 30 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (entry && Date.now() - entry.timestamp < CACHE_EXPIRY) {
    return entry.data;
  }
  cache.delete(key);
  return null;
}

function setCache<T>(key: string, data: T): void {
  if (cache.size > 50) {
    const firstKey = cache.keys().next().value;
    if (firstKey) cache.delete(firstKey);
  }
  cache.set(key, { data, timestamp: Date.now() });
}

async function fetchJSON<T>(url: string, cacheKey?: string): Promise<T> {
  const cached = getCached<T>(cacheKey || url);
  if (cached) return cached;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const data = (await response.json()) as T;
  if (cacheKey) setCache(cacheKey, data);
  return data;
}

export async function getCountries(): Promise<Country[]> {
  const url = `${RADIO_BROWSER_ENDPOINT}/countrycodes`;
  const params = new URLSearchParams({
    hidebroken: "true",
    limit: "250",
    reverse: "true",
    order: "stationcount",
  });
  const countries = await fetchJSON<Country[]>(`${url}?${params.toString()}`, "countries");
  return countries.filter((c) => c.stationcount >= 10);
}

export async function getLanguages(): Promise<Language[]> {
  const url = `${RADIO_BROWSER_ENDPOINT}/languages`;
  const languages = await fetchJSON<Language[]>(url, "languages");
  return languages.filter((lang) => lang.stationcount >= 100);
}

export function getStoredCountry(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function setStoredCountry(country: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, country);
}

interface FetchStationsOptions {
  signal?: AbortSignal;
  offset?: number;
  limit?: number;
  country?: string;
  language?: string;
}

export async function getStationsByCountry(
  options: FetchStationsOptions = {},
): Promise<Station[]> {
  const { signal, offset = 0, limit = 32, country = "IN", language } = options;
  const cacheKey = `stations_${country || 'all'}_${language || 'all'}_${offset}_${limit}`;

  const url = new URL(`${RADIO_BROWSER_ENDPOINT}/stations/search`);

  // Only set country parameter if it's not empty
  if (country && country !== "") {
    url.searchParams.set("country", country.toLowerCase());
  }

  if (language) {
    url.searchParams.set("language", language.toLowerCase());
  }

  url.searchParams.set("limit", String(limit));
  url.searchParams.set("offset", String(offset));
  url.searchParams.set("order", "clickcount");
  url.searchParams.set("hidebroken", "true");
  url.searchParams.set("reverse", "true");

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": USER_AGENT,
    },
    signal,
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch stations: ${response.statusText}`);
  }

  const data = (await response.json()) as Station[];
  setCache(cacheKey, data);

  const uniqueById = new Map<string, Station>();
  for (const station of data) {
    if (!uniqueById.has(station.stationuuid)) {
      uniqueById.set(station.stationuuid, station);
    }
  }

  return Array.from(uniqueById.values());
}

export async function getStationsByLanguage(
  options: FetchStationsOptions = {},
): Promise<Station[]> {
  const { signal, offset = 0, limit = 32, language } = options;

  if (!language) {
    throw new Error("Language parameter is required for getStationsByLanguage");
  }

  const cacheKey = `stations_lang_${language}_${offset}_${limit}`;

  const url = new URL(`${RADIO_BROWSER_ENDPOINT}/stations/search`);
  url.searchParams.set("language", language.toLowerCase());
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("offset", String(offset));
  url.searchParams.set("order", "clickcount");
  url.searchParams.set("hidebroken", "true");
  url.searchParams.set("reverse", "true");

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": USER_AGENT,
    },
    signal,
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch stations: ${response.statusText}`);
  }

  const data = (await response.json()) as Station[];
  setCache(cacheKey, data);

  const uniqueById = new Map<string, Station>();
  for (const station of data) {
    if (!uniqueById.has(station.stationuuid)) {
      uniqueById.set(station.stationuuid, station);
    }
  }

  return Array.from(uniqueById.values());
}

export async function getTamilStations(
  options: FetchStationsOptions = {},
): Promise<Station[]> {
  return getStationsByCountry({ ...options, country: "IN" });
}

export async function detectUserCountry(): Promise<string> {
  try {
    const stored = getStoredCountry();
    if (stored) return stored;

    const response = await fetch("https://ipapi.co/json/", {
      headers: { "User-Agent": USER_AGENT },
    });
    if (response.ok) {
      const data = (await response.json()) as UserLocation;
      if (data.country_code) {
        return data.country_code.toUpperCase();
      }
    }
  } catch {
    // Fall through
  }

  return "IN";
}

export function matchCountryToAvailable(
  detectedCountry: string,
  availableCountries: Country[],
): string {
  const normalized = detectedCountry.toUpperCase();

  const exactMatch = availableCountries.find(
    (c) => c.name.toUpperCase() === normalized,
  );
  if (exactMatch && exactMatch.stationcount > 0) {
    return exactMatch.name.toUpperCase();
  }

  return "IN";
}

export function generatePlaceholderSvg(tags: string, name: string): string {
  const colors = [
    ["#7c3aed", "#c026d3"],
    ["#2563eb", "#06b6d4"],
    ["#16a34a", "#84cc16"],
    ["#dc2626", "#f97316"],
    ["#db2777", "#ec4899"],
    ["#0891b2", "#22d3ee"],
    ["#7e22ce", "#a855f7"],
    ["#ea580c", "#facc15"],
  ];
  const hash = (name + tags).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const [c1, c2] = colors[hash % colors.length];
  const initial = name.charAt(0).toUpperCase() || "?";
  const tag = tags.split(",")[0]?.trim() || "";
  const tagInitial = tag ? tag.charAt(0).toUpperCase() : "";

  const escapeXml = (str: string) =>
    str.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case "<": return "&lt;";
        case ">": return "&gt;";
        case "&": return "&amp;";
        case "'": return "&apos;";
        case '"': return "&quot;";
        default: return c;
      }
    });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
<defs>
<linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" style="stop-color:${escapeXml(c1)}"/>
<stop offset="100%" style="stop-color:${escapeXml(c2)}"/>
</linearGradient>
</defs>
<rect width="200" height="200" rx="16" fill="url(#g)"/>
<text x="100" y="108" font-family="system-ui,sans-serif" font-size="72" font-weight="700" fill="white" text-anchor="middle" opacity="0.9">${escapeXml(initial)}</text>${tagInitial ? `
<text x="100" y="145" font-family="system-ui,sans-serif" font-size="18" font-weight="500" fill="white" text-anchor="middle" opacity="0.6">${escapeXml(tagInitial)}</text>` : ""}
</svg>`;

  const b64 = (str: string): string => {
    if (typeof window !== "undefined") {
      // Convert Unicode string to UTF-8 array buffer, then to base64
      return btoa(unescape(encodeURIComponent(str)));
    }
    return Buffer.from(str).toString("base64");
  };
  return `data:image/svg+xml;base64,${b64(svg)}`;
}

export function formatClickCount(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return String(count);
}

export function getCountryDisplayName(code: string): string {
  return countryDisplayNames[code.toUpperCase()] || code;
}

const countryDisplayNames: Record<string, string> = {
  IN: "India",
  US: "United States",
  GB: "United Kingdom",
  AU: "Australia",
  CA: "Canada",
  FR: "France",
  DE: "Germany",
  ES: "Spain",
  MX: "Mexico",
  BR: "Brazil",
  PT: "Portugal",
  IT: "Italy",
  RU: "Russia",
  JP: "Japan",
  KR: "South Korea",
  CN: "China",
  AR: "Argentina",
  NL: "Netherlands",
  PL: "Poland",
  TR: "Turkey",
  ID: "Indonesia",
  PH: "Philippines",
  TH: "Thailand",
  VN: "Vietnam",
  MY: "Malaysia",
  SG: "Singapore",
  LK: "Sri Lanka",
  NZ: "New Zealand",
  IE: "Ireland",
  ZA: "South Africa",
  CO: "Colombia",
  CL: "Chile",
  PE: "Peru",
  VE: "Venezuela",
  EG: "Egypt",
  SA: "Saudi Arabia",
  AE: "UAE",
  IL: "Israel",
  PK: "Pakistan",
  BD: "Bangladesh",
  GR: "Greece",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  CH: "Switzerland",
  AT: "Austria",
  BE: "Belgium",
  HU: "Hungary",
  CZ: "Czech Republic",
  SK: "Slovakia",
  RO: "Romania",
  UA: "Ukraine",
  BG: "Bulgaria",
  HR: "Croatia",
  RS: "Serbia",
  TW: "Taiwan",
  HK: "Hong Kong",
  NG: "Nigeria",
  KE: "Kenya",
  GH: "Ghana",
};
