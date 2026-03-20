# Isai Flow - Multi-Language Internet Radio Aggregator

## Overview

Isai Flow has been transformed into a multi-language internet radio aggregator that fetches stations from the [Radio Browser API](https://api.radio-browser.info) and automatically detects the user's country. It defaults to Indian stations when no match is found or when a matched country has fewer than 10 stations.

## New Features

### 1. Country-Based Filtering
- Fetches all available countries from Radio Browser API (`GET /countrycodes`)
- Filters countries with `stationcount >= 10`, ordered by station count
- **Location Detection**: Uses `https://ipapi.co/json` to detect the user's country code
- **Smart Matching**: Maps detected country code to Radio Browser country codes
- **Tamil Fallback**: Defaults to Indian stations when location can't be resolved
- **Persistent Preference**: Country selection is saved to `localStorage` and restored on next visit

### 2. Country Switcher Component
- Searchable dropdown in the top-right corner
- Shows station count for each country
- Highlights the currently active country
- Fully responsive and mobile-friendly

### 3. Enhanced Station Tiles
- **Favicon Fallback**: Generates a high-quality SVG placeholder based on station name and genre tags using a deterministic color gradient algorithm
- **Metadata Display**: Shows bitrate (kbps), codec, and click count (plays) for each station
- Visual "Live" badge for currently playing station

### 4. CSS Audio Visualizer
- 24-bar CSS-based visualizer in the PlayerBar
- Gradient colors (#a855f7 to #ec4899)
- Activates during playback, shows minimal idle state otherwise

### 5. Enhanced Player Bar
- Codec display next to bitrate
- Gradient-colored placeholder images for stations without favicons

## API Integration

### Data Flow

```
ipapi.co/json → detectUserCountry() → matchCountryToAvailable()
    → currentCountry state → getStationsByCountry(country)
    → Radio Browser /stations/search endpoint (country=IN)
```

### Key API Functions (`src/lib/radio-api.ts`)

| Function | Description |
|----------|-------------|
| `getCountries()` | Fetches countries with stationcount >= 10 from `/countrycodes` |
| `getStationsByCountry({ country, offset, limit })` | Fetches stations ordered by clickcount |
| `detectUserCountry()` | Detects via ipapi.co or defaults to INDIA |
| `matchCountryToAvailable(detected, availableCountries)` | Matches country code with fallback |
| `generatePlaceholderSvg(tags, name)` | Generates gradient SVG placeholder |
| `getCountryDisplayName(code)` | Maps country code to display name |

### Country Codes Endpoint

```
GET https://de1.api.radio-browser.info/json/countrycodes/?hidebroken=true&limit=250&reverse=true&order=stationcount
```

### API Route (`app/api/stations/route.ts`)

Accepts query parameters:
- `country` (string, default: "INDIA")
- `offset` (number, default: 0)
- `limit` (number, default: 32)

## Build Instructions

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Environment

No environment variables are required. The application runs entirely on the client side with external API calls to:
- `https://de1.api.radio-browser.info` - Radio station and country data
- `https://ipapi.co/json/` - User location detection

## Test Suite

### Running Tests

```bash
# Run all tests (watch mode)
npm test

# Run tests once (CI mode)
npm run test:run

# Run with coverage
npm run test:coverage
```

### Test Coverage

| File | Tests |
|------|-------|
| `tests/radio-api.test.ts` | Country matching, click count formatting, SVG placeholder, station fetching, country filtering |
| `tests/LanguageContext.test.tsx` | Context initialization, localStorage persistence, country switching |
| `tests/LanguageSwitcher.test.tsx` | Component rendering |

### Manual Testing Checklist

#### Country Detection & Filtering
- [ ] `GET /countrycodes` returns a list of countries with station counts
- [ ] Only countries with `stationcount >= 10` are shown in the dropdown
- [ ] User country is detected via ipapi.co on first load
- [ ] Detected country code matches an available Radio Browser country
- [ ] Indian stations are shown as default when location is unknown
- [ ] Indian stations are shown when matched country has 0 stations

#### Country Switching
- [ ] Dropdown opens on button click
- [ ] Search filters countries in real-time
- [ ] Clicking a country loads its stations
- [ ] Active country shows "Active" badge
- [ ] Country preference persists after page reload (localStorage)
- [ ] Dropdown closes on outside click or selection
- [ ] Switching country resets and refetches the station list

#### Station Display
- [ ] Station tiles show name, location, bitrate, codec, and plays
- [ ] Favicon loads from API when available
- [ ] SVG placeholder generates when favicon is missing
- [ ] SVG placeholder is unique per station (based on name + tags)
- [ ] "Live" badge appears on currently playing station
- [ ] Empty state shows when no stations are found

#### Audio Player
- [ ] CSS visualizer bars appear during playback
- [ ] Visualizer shows minimal idle bars when paused
- [ ] Bitrate and codec display in player bar
- [ ] Volume slider works
- [ ] Play/pause button works with spacebar

#### Responsiveness
- [ ] Country switcher is accessible on mobile
- [ ] Station grid adjusts columns for screen size
- [ ] Player bar adapts to mobile layout

#### Persistence
- [ ] Country preference saved to localStorage after selection
- [ ] Country preference restored from localStorage on page load
- [ ] Recent stations list persists in memory during session

## File Changes Summary

| File | Change |
|------|--------|
| `src/lib/radio-api.ts` | Replaced language filter with country filter. Added `getCountries()`, `Country` type, `detectUserCountry()`, `matchCountryToAvailable()`, `getCountryDisplayName()`. Removed language mappings. |
| `src/context/LanguageContext.tsx` | Renamed to `CountryProvider`/`useCountry()`. Filters by country instead of language. |
| `app/api/stations/route.ts` | Changed `language` param to `country` param, uses `getStationsByCountry()` |
| `app/page.tsx` | Updated description text |
| `app/layout.tsx` | Uses `CountryProvider`, `CountrySwitcher` in header |
| `src/components/LanguageSwitcher.tsx` | Renamed to `CountrySwitcher` - filters by country with station counts |
| `src/components/StationGrid.tsx` | SVG placeholder fallback, bitrate/codec/clickcount display |
| `src/components/PlayerBar.tsx` | CSS audio visualizer, codec display, enhanced placeholder |
| `src/components/StationsPageClient.tsx` | Integrated with `useCountry()` for country-aware station loading with reset on country change |
| `src/components/Sidebar.tsx` | Removed dropdown, updated text to "Multi-Language Internet Radio", fixed layout |
| `tests/*.test.*` | Updated tests for country-based filtering |
| `README_UPDATE.md` | This file |
