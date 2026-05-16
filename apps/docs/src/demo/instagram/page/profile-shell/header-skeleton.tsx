"use client";

export function ProfileHeaderSkeleton() {
  return (
    <div className="bg-white pb-2">
      <div className="flex items-start gap-6 px-4 pt-4">
        <div className="h-[88px] w-[88px] shrink-0 animate-pulse rounded-full bg-neutral-100" />
        <div className="mt-1 flex flex-1 items-center justify-around">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="h-4 w-7 animate-pulse rounded bg-neutral-100" />
              <div className="h-3 w-9 animate-pulse rounded bg-neutral-100" />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 space-y-1.5 px-4">
        <div className="h-3.5 w-20 animate-pulse rounded bg-neutral-100" />
        <div className="h-3 w-44 animate-pulse rounded bg-neutral-100" />
        <div className="h-3 w-32 animate-pulse rounded bg-neutral-100" />
      </div>
      <div className="mt-3 flex gap-1.5 px-4">
        <div className="h-8 flex-1 animate-pulse rounded-lg bg-neutral-100" />
        <div className="h-8 flex-1 animate-pulse rounded-lg bg-neutral-100" />
        <div className="h-8 w-9 animate-pulse rounded-lg bg-neutral-100" />
      </div>
      <div className="mt-4 flex gap-4 px-4 pb-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="h-[64px] w-[64px] animate-pulse rounded-full bg-neutral-100" />
            <div className="h-2.5 w-10 animate-pulse rounded bg-neutral-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
