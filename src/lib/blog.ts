import { SITE_NAME, SITE_URL } from "@/src/lib/site";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readTime: string;
  keywords: string[];
  sections: Array<{
    heading?: string;
    paragraphs: string[];
  }>;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "best-tamil-fm-radio-stations-online",
    title: "Best Tamil FM Radio Stations to Listen Online (Free)",
    description:
      "Discover the top Tamil FM radio stations you can stream free online. From Chennai hits to diaspora favourites — listen on any device with Isai Flow.",
    publishedAt: "2026-03-01",
    readTime: "5 min read",
    keywords: [
      "tamil fm radio online",
      "best tamil radio stations",
      "listen tamil fm free",
      "tamil internet radio",
    ],
    sections: [
      {
        paragraphs: [
          `Tamil FM radio remains one of the most popular ways to enjoy film songs, news, and talk shows — whether you are in Chennai, Coimbatore, or listening from abroad. ${SITE_NAME} brings the best Tamil FM stations into one free web player so you never need to hunt for broken streams again.`,
        ],
      },
      {
        heading: "Why listen to Tamil FM online?",
        paragraphs: [
          "Traditional FM signals do not travel across borders. If you live in the US, UK, Canada, Singapore, or Malaysia, online streaming is the only way to hear live Tamil FM from home. A good aggregator filters broken links, sorts stations by popularity, and gives you a clean player that works on phone and desktop.",
          "Unlike downloading multiple apps, a browser-based player like Isai Flow loads instantly, requires no sign-up, and lets you switch between stations in one tap.",
        ],
      },
      {
        heading: "Top Tamil FM genres to explore",
        paragraphs: [
          "Film music stations dominate Tamil FM — expect non-stop Kollywood hits, retro classics, and new releases. News and talk stations cover politics, sports, and local events from Tamil Nadu and Sri Lanka. Devotional and Carnatic stations are perfect for morning listening or festival seasons.",
          `Browse by genre on ${SITE_NAME}: Carnatic, Tamil film songs, FM radio, news, and devotional — each category surfaces the most-listened stations from our catalogue.`,
        ],
      },
      {
        heading: "How to get started",
        paragraphs: [
          `Visit ${SITE_URL}, pick a station, and press Play. Heart your favourites to save them in the sidebar. Share any station page on WhatsApp so friends and family can listen too — every station has its own link you can bookmark.`,
          "For the best experience, use headphones or connect to a speaker, and add the site to your phone's home screen for app-like access.",
        ],
      },
    ],
  },
  {
    slug: "listen-tamil-radio-from-abroad",
    title: "How to Listen to Tamil Radio from Abroad (USA, UK, Canada & More)",
    description:
      "Missing Tamil FM from home? Learn how to stream live Tamil radio from the USA, UK, Canada, Singapore, and Malaysia — free, no app required.",
    publishedAt: "2026-03-05",
    readTime: "6 min read",
    keywords: [
      "tamil radio abroad",
      "tamil radio usa",
      "tamil radio uk",
      "tamil diaspora radio",
      "listen tamil fm overseas",
    ],
    sections: [
      {
        paragraphs: [
          "For millions of Tamils living outside India and Sri Lanka, radio is more than background noise — it is a connection to language, music, and home. Tamil FM does not broadcast over the air in most foreign countries, but internet radio makes geography irrelevant.",
        ],
      },
      {
        heading: "The diaspora listening challenge",
        paragraphs: [
          "YouTube live streams go offline. Random websites serve pop-up ads and dead links. Mobile apps often need updates or region locks. The simplest solution is a dedicated Tamil radio web player that aggregates verified HTTPS streams from the Radio Browser network.",
          `${SITE_NAME} was built for exactly this: one place to stream Tamil stations from Tamil Nadu, Sri Lanka, Malaysia, and the global Tamil community.`,
        ],
      },
      {
        heading: "Best setup for listeners abroad",
        paragraphs: [
          "Use any modern browser — Chrome, Safari, or Firefox on phone, tablet, or laptop. Wi-Fi is ideal for high-bitrate FM streams; mobile data works fine for standard quality.",
          "Add isaiflow.in to your home screen (Share → Add to Home Screen on iPhone, or Install app prompt on Android) for quick access like a native app.",
          "Share station links in family WhatsApp groups — when someone finds a great stream, everyone can listen from the same page.",
        ],
      },
      {
        heading: "Popular stations for expats",
        paragraphs: [
          "Chennai-based FM stations are the most requested among diaspora listeners. Sri Lankan Tamil stations are essential for listeners in Europe and the Gulf. Malaysian Tamil radio connects the large Tamil community in Kuala Lumpur and beyond.",
          `Explore location pages on ${SITE_NAME} — Tamil Nadu, Chennai, Sri Lanka, Malaysia, and India — to find stations that match where you are from.`,
        ],
      },
    ],
  },
  {
    slug: "tamil-carnatic-radio-online-guide",
    title: "Tamil Carnatic Radio Online – Free Streaming Guide",
    description:
      "Stream live Carnatic music and Tamil classical radio online for free. A complete guide to finding the best Carnatic stations on Isai Flow.",
    publishedAt: "2026-03-10",
    readTime: "5 min read",
    keywords: [
      "carnatic radio online",
      "tamil classical music radio",
      "carnatic music streaming",
      "devotional tamil radio",
    ],
    sections: [
      {
        paragraphs: [
          "Carnatic music has a devoted global audience — from morning ragas to kutcheri broadcasts and devotional sessions. Online radio lets you listen to live Carnatic programming anytime, whether you are practising, studying, or simply unwinding.",
        ],
      },
      {
        heading: "What to expect from Carnatic radio streams",
        paragraphs: [
          "Stations tagged with Carnatic, classical, or devotional often broadcast vocal and instrumental performances, slokas, and festival specials. Quality varies by broadcaster — look for streams marked with higher bitrates (128 kbps and above) for clearer audio.",
          `${SITE_NAME} filters Tamil-language stations and lets you browse the Carnatic genre directly, sorted by listener popularity.`,
        ],
      },
      {
        heading: "When to listen",
        paragraphs: [
          "Many listeners tune in during morning hours (Suprabhatam and early ragas), evening concerts, and festival seasons like Margazhi and Navaratri. Because streams are live, you will hear whatever the station is broadcasting right now — part of the charm of radio.",
        ],
      },
      {
        heading: "Tips for the best experience",
        paragraphs: [
          "Use the persistent player on Isai Flow — start a Carnatic station and browse related stations without interrupting playback. Save your favourite classical stations to the sidebar for quick return visits.",
          `Head to ${SITE_URL}/genre/carnatic to explore the full Carnatic catalogue, or search from the homepage for specific station names.`,
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return BLOG_POSTS.map((post) => post.slug);
}
