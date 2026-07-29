export default function Loading() {
  return (
    <div className="flex h-full flex-1 flex-col gap-6">
      <div className="h-4 w-40 animate-pulse rounded-full bg-white/10" />

      <section className="overflow-hidden rounded-3xl border border-[var(--border)] bg-white/[0.03] p-5 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
          <div className="mx-auto aspect-square w-full max-w-[280px] animate-pulse rounded-3xl bg-white/10 sm:mx-0 sm:w-56 md:w-64" />
          <div className="min-w-0 flex-1 space-y-4">
            <div className="h-4 w-24 animate-pulse rounded-full bg-white/10" />
            <div className="h-10 w-64 max-w-full animate-pulse rounded-2xl bg-white/10" />
            <div className="flex flex-wrap gap-3">
              <div className="h-4 w-28 animate-pulse rounded-full bg-white/10" />
              <div className="h-4 w-20 animate-pulse rounded-full bg-white/10" />
              <div className="h-4 w-28 animate-pulse rounded-full bg-white/10" />
            </div>
            <div className="h-11 w-40 animate-pulse rounded-full bg-white/10" />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-white/[0.02] p-5 sm:p-6">
        <div className="h-6 w-40 animate-pulse rounded-full bg-white/10" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="h-12 animate-pulse rounded-xl bg-white/5" />
          <div className="h-12 animate-pulse rounded-xl bg-white/5" />
          <div className="h-12 animate-pulse rounded-xl bg-white/5" />
          <div className="h-12 animate-pulse rounded-xl bg-white/5" />
        </div>
      </section>
    </div>
  );
}
