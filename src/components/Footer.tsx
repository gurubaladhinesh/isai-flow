import Link from "next/link";
import { POPULAR_GENRES, POPULAR_LOCATIONS, SITE_NAME } from "@/src/lib/site";
import { LIVE_LANGUAGES, languageListenPath } from "@/src/lib/languages";

export function Footer() {
  return (
    <footer className="mt-4 border-t border-[var(--border)] pt-6 text-sm text-[var(--muted)]">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <h2 className="font-display text-sm font-semibold text-[var(--text)]">
            About {SITE_NAME}
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed">
            {SITE_NAME} is a free internet radio player for Tamil and other
            South Indian languages. Stream live FM stations, film hits, and
            classical music from India, Sri Lanka, Malaysia, and beyond.
          </p>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold text-[var(--text)]">
            Browse by genre
          </h2>
          <ul className="mt-2 space-y-1.5">
            {POPULAR_GENRES.map((genre) => (
              <li key={genre.slug}>
                <Link
                  href={`/genre/${genre.slug}`}
                  className="transition hover:text-[var(--accent-bright)]"
                >
                  {genre.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold text-[var(--text)]">
            Guides
          </h2>
          <ul className="mt-2 space-y-1.5">
            <li>
              <Link
                href="/blog"
                className="transition hover:text-[var(--accent-bright)]"
              >
                Tamil radio guides
              </Link>
            </li>
            <li>
              <Link
                href="/blog/best-tamil-fm-radio-stations-online"
                className="transition hover:text-[var(--accent-bright)]"
              >
                Best Tamil FM stations
              </Link>
            </li>
            <li>
              <Link
                href="/blog/listen-tamil-radio-from-abroad"
                className="transition hover:text-[var(--accent-bright)]"
              >
                Listen from abroad
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold text-[var(--text)]">
            Browse by language
          </h2>
          <ul className="mt-2 space-y-1.5">
            {LIVE_LANGUAGES.map((language) => (
              <li key={language.slug}>
                <Link
                  href={languageListenPath(language.slug)}
                  className="transition hover:text-[var(--accent-bright)]"
                >
                  {language.englishName}{" "}
                  <span className="text-[11px] opacity-70">
                    {language.nativeName}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold text-[var(--text)]">
            Browse by location
          </h2>
          <ul className="mt-2 space-y-1.5">
            {POPULAR_LOCATIONS.map((location) => (
              <li key={location.slug}>
                <Link
                  href={`/location/${location.slug}`}
                  className="transition hover:text-[var(--accent-bright)]"
                >
                  {location.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-4 text-xs">
        <p>© {new Date().getFullYear()} {SITE_NAME}. Free radio streaming.</p>
        <a
          href="https://github.com/gurubaladhinesh/isai-flow"
          target="_blank"
          rel="noreferrer"
          className="transition hover:text-[var(--warm)]"
        >
          Open source on GitHub
        </a>
      </div>
    </footer>
  );
}
