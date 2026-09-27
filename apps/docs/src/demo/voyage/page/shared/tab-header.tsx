"use client";

/** Sticky title bar for the Saved, Trips and Profile tabs. */
export function TabHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="sticky top-0 z-10 flex items-baseline justify-between bg-white/95 px-5 pt-5 pb-3 backdrop-blur-sm">
      <h1 className="text-[22px] font-extrabold tracking-tight text-neutral-900">
        {title}
      </h1>
      {subtitle && (
        <span className="text-[13px] font-medium text-neutral-500">
          {subtitle}
        </span>
      )}
    </div>
  );
}
