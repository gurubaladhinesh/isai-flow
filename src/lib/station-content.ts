import type { Station } from "@/src/lib/radio-api";
import { SITE_NAME } from "@/src/lib/site";

function parseTags(station: Station): string[] {
  if (!station.tags) return [];
  return station.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function languageLabel(station: Station): string {
  const raw = station.language?.split(",")[0]?.trim();
  if (!raw) return "Tamil";
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function getLocationLabel(station: Station): string {
  if (station.state) {
    return `${station.state}, ${station.country}`;
  }
  return station.country || "around the world";
}

export function buildStationIntro(station: Station): string {
  const location = getLocationLabel(station);
  const tags = parseTags(station);
  const tagPhrase =
    tags.length > 0
      ? ` featuring ${tags.slice(0, 3).join(", ")}`
      : ` with ${languageLabel(station)} music and talk`;

  return `${station.name} is a live ${languageLabel(station)} radio station broadcasting from ${location}${tagPhrase}. Stream it free on ${SITE_NAME} — no app download, no sign-up, just press play.`;
}

export function buildStationListeningGuide(station: Station): string {
  const location = getLocationLabel(station);
  const quality =
    station.bitrate > 0
      ? `${station.bitrate} kbps audio quality`
      : "adaptive streaming quality";

  return `Whether you are in ${location} or listening from abroad, ${station.name} brings ${languageLabel(station)} radio straight to your browser. ${SITE_NAME} delivers ${quality} with a persistent player that keeps playing as you browse other stations. Save ${station.name} to your favorites for one-tap access anytime.`;
}

export function buildStationDiasporaNote(station: Station): string {
  const tags = parseTags(station);
  const lang = languageLabel(station);
  const genreHint =
    tags.some((tag) => /carnatic|classical|devotional/i.test(tag))
      ? "Carnatic and devotional listeners"
      : tags.some((tag) => /film|music|hits/i.test(tag))
        ? `${lang} film music fans`
        : `${lang} speakers`;

  return `${genreHint} across the US, UK, Canada, Singapore, Malaysia, and the Gulf rely on ${SITE_NAME} to stay connected to ${lang} culture. Bookmark this page and share it with family on WhatsApp so they can listen to ${station.name} too.`;
}

export function buildStationFaqs(station: Station) {
  const location = getLocationLabel(station);

  return [
    {
      question: `Is ${station.name} free to listen?`,
      answer: `Yes. ${SITE_NAME} provides free, unlimited access to ${station.name} and every ${languageLabel(station)} radio station in our catalogue.`,
    },
    {
      question: `Can I listen to ${station.name} on my phone?`,
      answer: `Yes. Open this page on any mobile browser — Android or iPhone — and tap Play. No app store download required.`,
    },
    {
      question: `What audio quality does ${station.name} offer?`,
      answer:
        station.bitrate > 0
          ? `${station.name} streams at ${station.bitrate} kbps for clear ${languageLabel(station)} audio on Wi-Fi and mobile data.`
          : `${station.name} uses adaptive bitrate streaming that adjusts to your internet connection.`,
    },
    {
      question: `Where is ${station.name} based?`,
      answer: `${station.name} broadcasts from ${location}. You can listen from anywhere in the world on ${SITE_NAME}.`,
    },
    {
      question: `How do I share ${station.name} with friends?`,
      answer: `Use the WhatsApp or Copy link buttons above to share this page. Friends can start listening instantly without creating an account.`,
    },
  ];
}
