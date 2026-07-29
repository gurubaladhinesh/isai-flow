export default function Loading() {
  const items = Array.from({ length: 12 });

  return (
    <div className="flex h-full flex-1 flex-col gap-8">
      <header className="overflow-hidden rounded-3xl border border-[var(--border)] bg-white/[0.03] px-5 py-8 sm:px-8 sm:py-10">
        <div className="h-4 w-28 animate-pulse rounded-full bg-white/10" />
        <div className="mt-4 h-10 w-72 max-w-full animate-pulse rounded-2xl bg-white/10 sm:h-12 sm:w-[28rem]" />
        <div className="mt-3 h-4 w-56 max-w-full animate-pulse rounded-full bg-white/5 sm:w-80" />
      </header>

      <div className="h-12 w-full animate-pulse rounded-2xl bg-white/5" />

      <section className="flex-1 pb-6">
        <div className="mb-3 h-5 w-32 animate-pulse rounded-full bg-white/10" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
          {items.map((_, index) => (
            <div
              key={index}
              className="flex flex-col rounded-2xl border border-[var(--border)] bg-white/[0.03] p-2.5"
            >
              <div className="mb-2.5 aspect-square w-full animate-pulse rounded-xl bg-[#15201c]" />
              <div className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
              <div className="mt-2 flex items-center justify-between">
                <div className="h-2 w-16 animate-pulse rounded-full bg-white/5" />
                <div className="h-4 w-8 animate-pulse rounded-md bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
