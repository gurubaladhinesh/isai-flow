import { SITE_NAME, SITE_URL } from "@/src/lib/site";
import type { Station } from "@/src/lib/radio-api";
import { getStationUrl } from "@/src/lib/slug";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getStationOgImage(station: Station): string {
  const favicon = station.favicon?.trim();
  if (favicon && (favicon.startsWith("http://") || favicon.startsWith("https://"))) {
    return favicon;
  }
  return absoluteUrl("/station-default.svg");
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["WebSite", "RadioBroadcastService"],
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Premium Tamil internet radio streaming service featuring live Tamil FM stations, Carnatic music, and film hits from around the world.",
    logo: absoluteUrl("/favicon.ico"),
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    sameAs: ["https://github.com/gurubaladhinesh/isai-flow"],
    inLanguage: "ta",
    genre: ["Tamil Music", "Carnatic Music", "Tamil Film Songs", "FM Radio"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    offers: {
      "@type": "Offer",
      category: "Subscription",
      price: "0",
      priceCurrency: "USD",
      description: "Free access to Tamil radio stations worldwide",
    },
  };
}

export function buildBreadcrumbJsonLd(
  items: Array<{ label: string; href?: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}

export function buildStationJsonLd(station: Station) {
  const path = getStationUrl(station);
  const tags = station.tags
    ? station.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : ["Tamil Radio"];

  return {
    "@context": "https://schema.org",
    "@type": "RadioChannel",
    name: station.name,
    url: absoluteUrl(path),
    image: getStationOgImage(station),
    broadcastAffiliateOf: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    inLanguage: station.language || "ta",
    genre: tags,
    ...(station.country
      ? {
          areaServed: {
            "@type": "Place",
            name: station.state
              ? `${station.state}, ${station.country}`
              : station.country,
          },
        }
      : {}),
  };
}
