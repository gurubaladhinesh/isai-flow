"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LIVE_LANGUAGES,
  languageListenPath,
} from "@/src/lib/languages";

export function LanguageNav({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Radio languages">
      {!compact ? (
        <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          Languages
        </p>
      ) : null}
      <ul
        className={
          compact
            ? "flex flex-wrap gap-2"
            : "space-y-0.5"
        }
      >
        {LIVE_LANGUAGES.map((language) => {
          const href = languageListenPath(language.slug);
          const isActive =
            language.slug === "tamil"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <li key={language.slug}>
              <Link
                href={href}
                className={
                  compact
                    ? `inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
                        isActive
                          ? "border-[var(--accent)]/50 bg-[var(--accent)]/15 text-[var(--accent-bright)]"
                          : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/40 hover:text-[var(--text)]"
                      }`
                    : `flex min-h-9 w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition ${
                        isActive
                          ? "bg-[var(--accent)]/15 text-[var(--accent-bright)]"
                          : "text-[var(--muted)] hover:bg-white/5 hover:text-[var(--text)]"
                      }`
                }
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden="true">{language.nativeLetter}</span>
                  <span>{language.englishName}</span>
                </span>
                {compact ? (
                  <span className="text-[10px] opacity-70">
                    {language.nativeName}
                  </span>
                ) : (
                  <span className="text-[11px] opacity-70">
                    {language.nativeName}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
