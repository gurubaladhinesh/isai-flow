export interface RadioLanguage {
  slug: string;
  /** Radio Browser `language` search value */
  apiName: string;
  englishName: string;
  nativeName: string;
  iso639: string;
  ogLocale: string;
  nativeLetter: string;
  tagline: string;
  headline: string;
  description: string;
  wave: 1 | 2;
}

/**
 * Wave 1 languages are live in the UI.
 * Wave 2 is catalogued for a later rollout once Wave 1 traffic is proven.
 *
 * Radio Browser already indexes all of these via `?language=<apiName>`.
 */
export const RADIO_LANGUAGES: RadioLanguage[] = [
  {
    slug: "tamil",
    apiName: "tamil",
    englishName: "Tamil",
    nativeName: "தமிழ்",
    iso639: "ta",
    ogLocale: "ta_IN",
    nativeLetter: "இ",
    tagline: "Tamil Internet Radio",
    headline: "Live Tamil radio, tuned for listening.",
    description:
      "Stream film hits, Carnatic, and FM stations from around the world — without the clutter.",
    wave: 1,
  },
  {
    slug: "telugu",
    apiName: "telugu",
    englishName: "Telugu",
    nativeName: "తెలుగు",
    iso639: "te",
    ogLocale: "te_IN",
    nativeLetter: "తె",
    tagline: "Telugu Internet Radio",
    headline: "Live Telugu radio, from Tollywood to news.",
    description:
      "Stream Telugu film songs, FM, and talk radio from Andhra Pradesh, Telangana, and the diaspora.",
    wave: 1,
  },
  {
    slug: "malayalam",
    apiName: "malayalam",
    englishName: "Malayalam",
    nativeName: "മലയാളം",
    iso639: "ml",
    ogLocale: "ml_IN",
    nativeLetter: "മ",
    tagline: "Malayalam Internet Radio",
    headline: "Live Malayalam radio from Kerala and beyond.",
    description:
      "Stream Malayalam FM, film hits, and news stations from Kerala, the Gulf, and worldwide.",
    wave: 1,
  },
  {
    slug: "kannada",
    apiName: "kannada",
    englishName: "Kannada",
    nativeName: "ಕನ್ನಡ",
    iso639: "kn",
    ogLocale: "kn_IN",
    nativeLetter: "ಕ",
    tagline: "Kannada Internet Radio",
    headline: "Live Kannada radio, tuned for listening.",
    description:
      "Stream Kannada film music, FM, and talk radio from Karnataka and the global Kannada community.",
    wave: 1,
  },
  {
    slug: "hindi",
    apiName: "hindi",
    englishName: "Hindi",
    nativeName: "हिन्दी",
    iso639: "hi",
    ogLocale: "hi_IN",
    nativeLetter: "हि",
    tagline: "Hindi Internet Radio",
    headline: "Live Hindi radio from across India.",
    description:
      "Stream Bollywood hits, news, and FM stations in Hindi — free in the browser, no app required.",
    wave: 1,
  },
  {
    slug: "sinhala",
    apiName: "sinhala",
    englishName: "Sinhala",
    nativeName: "සිංහල",
    iso639: "si",
    ogLocale: "si_LK",
    nativeLetter: "සි",
    tagline: "Sinhala Internet Radio",
    headline: "Live Sinhala radio from Sri Lanka.",
    description:
      "Stream Sinhala FM, news, and music stations from Sri Lanka and the diaspora.",
    wave: 1,
  },
  {
    slug: "punjabi",
    apiName: "punjabi",
    englishName: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
    iso639: "pa",
    ogLocale: "pa_IN",
    nativeLetter: "ਪੰ",
    tagline: "Punjabi Internet Radio",
    headline: "Live Punjabi radio, bhangra to news.",
    description:
      "Stream Punjabi music and talk radio from India, Pakistan, the UK, and Canada.",
    wave: 2,
  },
  {
    slug: "bengali",
    apiName: "bengali",
    englishName: "Bengali",
    nativeName: "বাংলা",
    iso639: "bn",
    ogLocale: "bn_IN",
    nativeLetter: "বা",
    tagline: "Bengali Internet Radio",
    headline: "Live Bengali radio from Bengal and Bangladesh.",
    description:
      "Stream Bangla FM, news, and music from West Bengal, Bangladesh, and abroad.",
    wave: 2,
  },
  {
    slug: "marathi",
    apiName: "marathi",
    englishName: "Marathi",
    nativeName: "मराठी",
    iso639: "mr",
    ogLocale: "mr_IN",
    nativeLetter: "म",
    tagline: "Marathi Internet Radio",
    headline: "Live Marathi radio from Maharashtra.",
    description:
      "Stream Marathi FM, film songs, and talk radio from Mumbai, Pune, and beyond.",
    wave: 2,
  },
  {
    slug: "gujarati",
    apiName: "gujarati",
    englishName: "Gujarati",
    nativeName: "ગુજરાતી",
    iso639: "gu",
    ogLocale: "gu_IN",
    nativeLetter: "ગુ",
    tagline: "Gujarati Internet Radio",
    headline: "Live Gujarati radio for listeners worldwide.",
    description:
      "Stream Gujarati FM and music stations from Gujarat, East Africa, the UK, and the US.",
    wave: 2,
  },
];

export const DEFAULT_LANGUAGE_SLUG = "tamil";

export const LIVE_LANGUAGES = RADIO_LANGUAGES.filter(
  (language) => language.wave === 1,
);

export function getLanguageBySlug(slug: string): RadioLanguage | undefined {
  return RADIO_LANGUAGES.find((language) => language.slug === slug);
}

export function getLiveLanguageBySlug(slug: string): RadioLanguage | undefined {
  return LIVE_LANGUAGES.find((language) => language.slug === slug);
}

export function isLiveLanguageSlug(slug: string): boolean {
  return LIVE_LANGUAGES.some((language) => language.slug === slug);
}

export function languageListenPath(slug: string): string {
  if (slug === DEFAULT_LANGUAGE_SLUG) return "/";
  return `/listen/${slug}`;
}
