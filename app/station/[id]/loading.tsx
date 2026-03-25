export default function Loading() {
  return (
    <div className="flex h-full flex-1 flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative aspect-square w-24 animate-pulse rounded-xl bg-white/10 sm:w-32" />

          <div>
            <div className="h-8 w-64 animate-pulse rounded-full bg-white/10 sm:h-10" />

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="h-4 w-24 animate-pulse rounded-full bg-white/10" />
              <div className="h-4 w-20 animate-pulse rounded-full bg-white/10" />
              <div className="h-4 w-28 animate-pulse rounded-full bg-white/10" />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <div className="h-6 w-16 rounded-full bg-white/10" />
              <div className="h-6 w-20 rounded-full bg-white/10" />
              <div className="h-6 w-14 rounded-full bg-white/10" />
            </div>
          </div>
        </div>

        <div className="h-10 w-32 animate-pulse rounded-full bg-white/10" />
      </header>

      <section className="mt-4 border-t border-white/10 pt-6">
        <div className="h-6 w-40 animate-pulse rounded-full bg-white/10" />
        <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-white/10" />
        <div className="mt-2 h-4 w-5/6 animate-pulse rounded-full bg-white/10" />
      </section>
    </div>
  );
}