export default function Loading() {
  const items = Array.from({ length: 10 });

  return (
    <div className="flex h-full flex-1 flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="h-6 w-40 rounded-full bg-white/10 sm:h-8" />
          <div className="mt-2 h-3 w-56 rounded-full bg-white/5 sm:w-72" />
        </div>
      </header>

      <section className="flex-1 overflow-auto pb-6">
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
          {items.map((_, index) => (
            <div
              key={index}
              className="flex flex-col rounded-lg border border-white/5 bg-white/5/5 p-2"
            >
              <div className="mb-2 aspect-square w-full rounded-md bg-gradient-to-br from-zinc-800 via-zinc-900 to-black" />
              <div className="h-3 w-32 rounded-full bg-white/10" />
              <div className="mt-2 flex items-center justify-between">
                <div className="h-2 w-20 rounded-full bg-white/5" />
                <div className="h-4 w-10 rounded-full bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

