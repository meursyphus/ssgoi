export function AdBanner() {
  return (
    <div className="mx-4 mb-2 mt-2 flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-700 px-4 py-3 text-white">
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="text-[15px] font-bold leading-tight">Odyssey: Season 2</p>
        <p className="mt-0.5 text-[12px] text-white/80">
          Free to play, now live
        </p>
        <p className="mt-1 text-[10px] text-white/40">Ad · in-game purchases</p>
      </div>
      <div className="flex h-12 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-white/10 text-[11px] font-bold tracking-widest text-white">
        ODYSSEY
      </div>
    </div>
  );
}
