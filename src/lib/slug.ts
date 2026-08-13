/**
 * Creates an SEO-friendly slug from a station name
 * Handles Tamil Unicode characters and special symbols
 */
export function createSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/[^a-z0-9-\u0900-\u0D7F]/g, '') // Keep alphanumeric, hyphens, and Indic scripts
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .slice(0, 100); // Limit length to 100 characters
}

/**
 * Generates a full station URL with ID and slug
 */
export function getStationUrl(station: { stationuuid: string; name: string }): string {
  const slug = createSlug(station.name);
  return `/station/${station.stationuuid}${slug ? `-${slug}` : ''}`;
}

/**
 * Parses station ID from a URL
 */
export function parseStationUrl(url: string): string | null {
  const match = url.match(/^\/station\/([a-f0-9-]+)(?:-[a-z0-9-\u0B80-\u0BFF]*)?$/i);
  return match ? match[1] : null;
}

/**
 * Extracts a station UUID from a route param that may include an SEO slug.
 * e.g. "96144e01-...-c81-radio-mirchi" → "96144e01-...-c81"
 */
export function extractStationId(param: string): string {
  const uuidMatch = param.match(
    /^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i,
  );
  return uuidMatch ? uuidMatch[1] : param;
}