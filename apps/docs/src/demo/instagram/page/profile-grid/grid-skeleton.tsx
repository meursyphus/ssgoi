"use client";

export function GridSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-[2px] bg-white">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="aspect-square animate-pulse bg-neutral-100" />
      ))}
    </div>
  );
}
