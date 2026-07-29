"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
  }>;
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center text-sm" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-y-1">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center">
            {item.href ? (
              <Link
                href={item.href}
                className="font-medium text-[var(--muted)] transition hover:text-[var(--accent-bright)]"
              >
                {item.label}
              </Link>
            ) : (
              <span className="line-clamp-1 font-medium text-[var(--text)]">
                {item.label}
              </span>
            )}
            {index < items.length - 1 && (
              <ChevronRight className="mx-2 h-4 w-4 shrink-0 text-[var(--muted)]" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
