import type { Station } from "@/src/lib/radio-api";

const HOME_SCROLL_KEY = "isai-flow:home-scroll-v1";

export interface HomeScrollState {
  scrollY: number;
  offset: number;
  stations: Station[];
  hasMore: boolean;
  query: string;
}

export function saveHomeScrollState(state: HomeScrollState): void {
  try {
    sessionStorage.setItem(HOME_SCROLL_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota / private-mode failures.
  }
}

export function readHomeScrollState(): HomeScrollState | null {
  try {
    const raw = sessionStorage.getItem(HOME_SCROLL_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as HomeScrollState;
    if (
      typeof parsed.scrollY !== "number" ||
      typeof parsed.offset !== "number" ||
      !Array.isArray(parsed.stations)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearHomeScrollState(): void {
  try {
    sessionStorage.removeItem(HOME_SCROLL_KEY);
  } catch {
    // Ignore.
  }
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function smoothScrollTo(
  top: number,
  behavior: ScrollBehavior = "smooth",
): void {
  const resolved = prefersReducedMotion() ? "auto" : behavior;
  window.scrollTo({ top, behavior: resolved });
}

export function smoothScrollIntoView(
  element: HTMLElement,
  block: ScrollLogicalPosition = "start",
): void {
  element.scrollIntoView({
    block,
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
}
