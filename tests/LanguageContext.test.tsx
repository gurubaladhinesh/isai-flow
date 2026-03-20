import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CountryProvider, useCountry } from "@/src/context/LanguageContext";
import React from "react";

const mockCountries = [
  { name: "IN", stationcount: 500 },
  { name: "US", stationcount: 1000 },
  { name: "FR", stationcount: 200 },
];

function TestConsumer() {
  const { currentCountry, countries, isLoading, isInitialized, setCountry } = useCountry();
  return (
    <div>
      <span data-testid="country">{currentCountry}</span>
      <span data-testid="count">{countries.length}</span>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="initialized">{String(isInitialized)}</span>
      <button onClick={() => setCountry("US")} data-testid="set-us">Set US</button>
      <button onClick={() => setCountry("FR")} data-testid="set-fr">Set FR</button>
    </div>
  );
}

describe("CountryContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("initializes with default country INDIA", () => {
    render(
      <CountryProvider>
        <TestConsumer />
      </CountryProvider>
    );
    expect(screen.getByTestId("country")).toHaveTextContent("IN");
  });

  it("exposes countries from API", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockCountries),
    });

    render(
      <CountryProvider>
        <TestConsumer />
      </CountryProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("count")).toHaveTextContent("3");
    });
  });

  it("persists country preference to localStorage", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockCountries),
    });

    render(
      <CountryProvider>
        <TestConsumer />
      </CountryProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("initialized")).toHaveTextContent("true");
    });

    fireEvent.click(screen.getByTestId("set-us"));
    await waitFor(() => {
      expect(localStorage.getItem("isaiflow_country")).toBe("US");
    });

    fireEvent.click(screen.getByTestId("set-fr"));
    await waitFor(() => {
      expect(localStorage.getItem("isaiflow_country")).toBe("FR");
    });
  });

  it("loads stored country from localStorage on init", async () => {
    localStorage.setItem("isaiflow_country", "FR");

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockCountries),
    });

    render(
      <CountryProvider>
        <TestConsumer />
      </CountryProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("initialized")).toHaveTextContent("true");
    });

    expect(screen.getByTestId("country")).toHaveTextContent("FR");
  });

  it("is case-insensitive for country codes", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockCountries),
    });

    render(
      <CountryProvider>
        <TestConsumer />
      </CountryProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("initialized")).toHaveTextContent("true");
    });

    fireEvent.click(screen.getByTestId("set-us"));
    await waitFor(() => {
      expect(localStorage.getItem("isaiflow_country")).toBe("US");
    });
  });
});
