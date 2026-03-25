import Link from "next/link";
import { Radio } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-6 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-900/20 p-3">
          <Radio className="h-10 w-10 text-violet-400" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white">Station Not Found</h1>
          <p className="mt-2 text-zinc-400">
            The radio station you're looking for doesn't exist or is currently unavailable.
          </p>
        </div>
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 ring-1 ring-violet-300/70 transition hover:brightness-110 hover:shadow-violet-400/50"
      >
        Back to All Stations
      </Link>
    </div>
  );
}