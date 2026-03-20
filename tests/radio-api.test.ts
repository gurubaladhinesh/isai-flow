import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  matchCountryToAvailable,
  generatePlaceholderSvg,
  formatClickCount,
  getCountryDisplayName,
  getStationsByCountry,
  getCountries,
} from "@/src/lib/radio-api";
import type { Country, Station } from "@/src/lib/radio-api";

describe("radio-api utilities", () => {
  describe("matchCountryToAvailable", () => {
    const availableCountries: Country[] = [
      { name: "IN", stationcount: 500 },
      { name: "US", stationcount: 1000 },
      { name: "FR", stationcount: 200 },
      { name: "XX", stationcount: 0 },
    ];

    it("returns exact ISO match when found with stations", () => {
      expect(matchCountryToAvailable("IN", availableCountries)).toBe("IN");
      expect(matchCountryToAvailable("US", availableCountries)).toBe("US");
    });

    it("falls back to IN when country not found", () => {
      expect(matchCountryToAvailable("XYZ", availableCountries)).toBe("IN");
    });

    it("falls back to IN when matched country has 0 stations", () => {
      expect(matchCountryToAvailable("XX", availableCountries)).toBe("IN");
    });

    it("is case-insensitive", () => {
      expect(matchCountryToAvailable("in", availableCountries)).toBe("IN");
    });
  });

  describe("formatClickCount", () => {
    it("formats millions", () => {
      expect(formatClickCount(1500000)).toBe("1.5M");
      expect(formatClickCount(2000000)).toBe("2.0M");
    });

    it("formats thousands", () => {
      expect(formatClickCount(1500)).toBe("1.5K");
      expect(formatClickCount(2500)).toBe("2.5K");
    });

    it("returns plain number for small counts", () => {
      expect(formatClickCount(500)).toBe("500");
      expect(formatClickCount(0)).toBe("0");
    });
  });

  describe("getCountryDisplayName", () => {
    it("returns known country names", () => {
      expect(getCountryDisplayName("IN")).toBe("India");
      expect(getCountryDisplayName("US")).toBe("United States");
    });

    it("returns code for unknown countries", () => {
      expect(getCountryDisplayName("XYZ")).toBe("XYZ");
    });

    it("is case-insensitive", () => {
      expect(getCountryDisplayName("in")).toBe("India");
    });
  });

  describe("generatePlaceholderSvg", () => {
    it("generates valid SVG data URL", () => {
      const result = generatePlaceholderSvg("pop,jazz", "Radio One");
      expect(result).toMatch(/^data:image\/svg\+xml;base64,/);
    });

    it("uses first character of name as initial", () => {
      const result = generatePlaceholderSvg("", "Radio One");
      const decoded = atob(result.split(",")[1]);
      expect(decoded).toContain("R");
    });

    it("uses first tag character when tag exists", () => {
      const result = generatePlaceholderSvg("jazz", "Radio One");
      const decoded = atob(result.split(",")[1]);
      expect(decoded).toContain("J");
    });

    it("generates different SVGs for different name/tag combos", () => {
      const r1 = generatePlaceholderSvg("pop", "Sunshine FM");
      const r2 = generatePlaceholderSvg("jazz", "Moonlight AM");
      expect(r1).not.toBe(r2);
    });
  });

  describe("getStationsByCountry", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("fetches stations for a given country", async () => {
      const mockStations: Station[] = [
        {
          stationuuid: "uuid-1",
          name: "India FM",
          favicon: "https://example.com/logo.png",
          url: "https://stream.example.com",
          url_resolved: "https://stream.example.com",
          country: "India",
          country_code: "IN",
          state: "TN",
          language: "tamil",
          tags: "pop,music",
          bitrate: 128,
          codec: "MP3",
          clickcount: 1000,
          votes: 50,
          ssl_error: 0,
        },
      ];

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockStations),
      });
      global.fetch = mockFetch;

      const result = await getStationsByCountry({ country: "IN", limit: 10 });
      expect(result).toHaveLength(1);
      expect(mockFetch).toHaveBeenCalled();
    });

    it("removes duplicate stations by uuid", async () => {
      const mockStations: Station[] = [
        {
          stationuuid: "uuid-1",
          name: "India FM",
          favicon: "",
          url: "https://stream.example.com",
          url_resolved: "https://stream.example.com",
          country: "India",
          country_code: "IN",
          state: "TN",
          language: "tamil",
          tags: "pop",
          bitrate: 128,
          codec: "MP3",
          clickcount: 100,
          votes: 10,
          ssl_error: 0,
        },
        {
          stationuuid: "uuid-1",
          name: "India FM Duplicate",
          favicon: "",
          url: "https://stream.example.com",
          url_resolved: "https://stream.example.com",
          country: "India",
          country_code: "IN",
          state: "TN",
          language: "tamil",
          tags: "pop",
          bitrate: 128,
          codec: "MP3",
          clickcount: 200,
          votes: 20,
          ssl_error: 0,
        },
      ];

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockStations),
      });
      global.fetch = mockFetch;

      const result = await getStationsByCountry({ country: "IN", limit: 10 });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("India FM");
    });
  });

  describe("getCountries", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("filters countries with stationcount >= 10", async () => {
      const mockCountries: Country[] = [
        { name: "IN", stationcount: 500 },
        { name: "US", stationcount: 1000 },
        { name: "XX", stationcount: 5 },
      ];

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockCountries),
      });
      global.fetch = mockFetch;

      const result = await getCountries();
      expect(result).toHaveLength(2);
      expect(result.find((c) => c.name === "XX")).toBeUndefined();
    });
  });
});
