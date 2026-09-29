export function FeedSkeleton() {
  return (
    <>
      <section className="pt-6">
        <div className="mx-4 h-6 w-40 animate-pulse rounded-md bg-neutral-100" />
        <div className="flex gap-3 overflow-hidden px-4 pt-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="h-44 w-36 flex-shrink-0 animate-pulse rounded-2xl bg-neutral-100"
            />
          ))}
        </div>
      </section>
      <section className="pt-6">
        <div className="mx-4 h-6 w-52 animate-pulse rounded-md bg-neutral-100" />
        <div className="grid grid-cols-2 gap-3 px-4 pt-3">
          {Array.from({ length: 2 }).map((_, idx) => (
            <div
              key={idx}
              className="aspect-square animate-pulse rounded-2xl bg-neutral-100"
            />
          ))}
        </div>
      </section>
    </>
  );
}
