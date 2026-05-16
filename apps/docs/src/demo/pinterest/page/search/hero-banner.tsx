"use client";

export function HeroBanner() {
  return (
    <div>
      <div className="relative w-full overflow-hidden bg-neutral-200">
        <img
          src="/demo/pinterest/10-400x400.jpg"
          alt="Level up your screen aesthetics"
          className="w-full object-cover"
          style={{ aspectRatio: "1 / 1" }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <p className="text-[14px] font-medium tracking-wide drop-shadow">
            Digital updates
          </p>
          <h2 className="mt-1 text-[22px] font-bold leading-tight drop-shadow">
            Level up your screen aesthetics
          </h2>
        </div>
      </div>
      <div className="mt-3 flex justify-center gap-1.5">
        {Array.from({ length: 7 }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${
              i === 4 ? "bg-neutral-700" : "bg-neutral-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
