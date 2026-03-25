/**
 * Creates an SEO-friendly slug from a station name
 * Handles Tamil Unicode characters and special symbols
 */
export function createSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/[^a-z0-9-\u0B80-\u0BFF]/g, '') // Keep alphanumeric, hyphens, and Tamil Unicode
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
  const match = url.match(/^\/station\/([a-f0-9-]+)(?:-[a-z0-9-]*)?$/i);
  return match ? match[1] : null;
}