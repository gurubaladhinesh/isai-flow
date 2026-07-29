import Link from "next/link";
import { POPULAR_GENRES, POPULAR_LOCATIONS, SITE_NAME } from "@/src/lib/site";

export function Footer() {
  return (
    <footer className="mt-4 border-t border-[var(--border)] pt-6 text-sm text-[var(--muted)]">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <h2 className="font-display text-sm font-semibold text-[var(--text)]">
            About {SITE_NAME}
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed">
            {SITE_NAME} is a free Tamil internet radio player. Stream live FM
            stations, Carnatic music, and film hits from India, Sri Lanka,
            Malaysia, and beyond.
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
        <p>© {new Date().getFullYear()} {SITE_NAME}. Free Tamil radio streaming.</p>
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
