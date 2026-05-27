"use client";

const BG =
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=2400&q=80";
export default function DropPage() {
  return (
    <div
      data-ssgoi-transition="/demo/honeydrop/drop"
      className="relative h-full w-full"
    >
      <div className="relative h-full w-full overflow-hidden">
        <img
          src={BG}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/30 to-black/90" />

        <div className="relative flex h-full w-full flex-col items-center justify-between px-6 pt-32 pb-10 lg:px-10 lg:pt-40 lg:pb-14">
          <div className="flex flex-col items-center">
            <p className="font-serif text-xs tracking-[0.42em] text-[#f0b500]/85 uppercase">
              Chapter 02 · The Drop
            </p>
            <h1 className="mt-4 text-center font-serif text-6xl leading-[0.9] font-bold tracking-tight text-white sm:text-7xl lg:text-8xl">
              EXCLUSIVE
              <br />
              DROP.
            </h1>
          </div>

          <div className="flex flex-col items-center gap-4">
            <p className="text-[11px] tracking-[0.32em] text-white/90 uppercase">
              You&apos;ve unlocked the exclusive drop
            </p>
            <button
              type="button"
              className="rounded-sm border border-[#f0b500] px-7 py-3 text-[11px] font-bold tracking-[0.32em] text-[#f0b500] uppercase transition hover:bg-[#f0b500] hover:text-black"
            >
              Get It Now →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
