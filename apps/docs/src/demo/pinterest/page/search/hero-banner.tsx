"use client";

export function HeroBanner() {
  return (
    <div className="px-4">
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src="/demo/pinterest/22-400x1000.jpg"
          alt="Morimono-inspired wedding tablescapes"
          className="h-[260px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-4 pb-5 text-center text-white">
          <p className="text-[12px] font-medium tracking-wide text-white/90">
            Produce in bloom
          </p>
          <h2 className="mt-1 text-[18px] font-bold leading-tight">
            Morimono-inspired wedding
            <br />
            tablescapes
          </h2>
        </div>
      </div>
      <div className="mt-2 flex justify-center gap-1.5">
        {Array.from({ length: 7 }).map((_, i) => (
          <span
            key={i}
            className={`h-1 rounded-full transition-all ${
              i === 3 ? "w-3 bg-white" : "w-1 bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
