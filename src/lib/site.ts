export const SITE_URL = "https://isaiflow.in";
export const SITE_NAME = "Isai Flow";

export const POPULAR_GENRES = [
  { slug: "carnatic", label: "Carnatic", tag: "carnatic" },
  { slug: "film", label: "Tamil Film Songs", tag: "film" },
  { slug: "fm", label: "FM Radio", tag: "fm" },
  { slug: "news", label: "News", tag: "news" },
  { slug: "devotional", label: "Devotional", tag: "devotional" },
] as const;

export const POPULAR_LOCATIONS = [
  { slug: "tamil-nadu", label: "Tamil Nadu", state: "Tamil Nadu" },
  { slug: "chennai", label: "Chennai", state: "Chennai" },
  { slug: "india", label: "India", country: "India" },
  { slug: "sri-lanka", label: "Sri Lanka", country: "Sri Lanka" },
  { slug: "malaysia", label: "Malaysia", country: "Malaysia" },
] as const;
