import Link from "next/link";
import { Radio } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent-deep)]/40 p-3">
          <Radio className="h-10 w-10 text-[var(--accent-bright)]" />
        </div>

        <div>
          <h1 className="font-display text-2xl font-semibold text-[var(--text)]">
            Station Not Found
          </h1>
          <p className="mt-2 max-w-md text-[var(--muted)]">
            The radio station you&apos;re looking for doesn&apos;t exist or is
            currently unavailable.
          </p>
        </div>
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[#04110e] transition hover:bg-[var(--accent-bright)]"
      >
        Back to All Stations
      </Link>
    </div>
  );
}
