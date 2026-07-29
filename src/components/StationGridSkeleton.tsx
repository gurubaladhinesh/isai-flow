interface StationGridSkeletonProps {
  count?: number;
  inline?: boolean;
}

function SkeletonTile() {
  return (
    <div className="station-tile-virtualized flex flex-col rounded-2xl border border-[var(--border)] bg-white/[0.03] p-2.5">
      <div className="mb-2.5 aspect-square w-full animate-pulse rounded-xl bg-[#15201c]" />
      <div className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
      <div className="mt-2 flex items-center justify-between">
        <div className="h-2 w-16 animate-pulse rounded-full bg-white/5" />
        <div className="h-4 w-8 animate-pulse rounded-md bg-white/5" />
      </div>
    </div>
  );
}

export function StationGridSkeleton({
  count = 8,
  inline = false,
}: StationGridSkeletonProps) {
  if (inline) {
    return (
      <>
        {Array.from({ length: count }).map((_, index) => (
          <SkeletonTile key={index} />
        ))}
      </>
    );
  }

  return (
    <div
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonTile key={index} />
      ))}
    </div>
  );
}
