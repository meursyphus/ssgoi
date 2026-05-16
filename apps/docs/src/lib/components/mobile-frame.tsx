"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

function StatusBar() {
  const pathname = usePathname();

  return (
    <div className="relative hidden bg-black text-white shrink-0 select-none md:block">
      <div className="flex justify-center pt-2 pb-1">
        <div className="flex h-7 w-32 items-center gap-3 rounded-full border border-white/10 bg-black px-3">
          <div className="h-2 w-2 rounded-full bg-neutral-800 ring-1 ring-white/20" />
          <div className="flex-1" />
          <div className="flex gap-0.5">
            <div className="h-0.5 w-0.5 rounded-full bg-red-500/60" />
            <div className="h-0.5 w-0.5 rounded-full bg-red-500/40" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-5 py-1 text-[11px] font-medium">
        <span>9:41</span>
        <span className="absolute left-1/2 max-w-[55%] -translate-x-1/2 truncate text-[10px] text-white/40">
          {pathname}
        </span>
        <div className="flex items-center gap-1">
          <div className="flex items-end gap-[1px]">
            <div className="h-1.5 w-0.5 rounded-full bg-white/90" />
            <div className="h-2 w-0.5 rounded-full bg-white/90" />
            <div className="h-2.5 w-0.5 rounded-full bg-white/90" />
            <div className="h-3 w-0.5 rounded-full bg-white/90" />
          </div>
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-3.5 w-3.5 text-white/90"
          >
            <path d="M12 18c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0-4c1.66 0 3.16.64 4.29 1.68l1.42-1.42C16.08 12.63 14.13 12 12 12s-4.08.63-5.71 2.26l1.42 1.42C8.84 14.64 10.34 14 12 14zm0-4c2.76 0 5.26 1.12 7.07 2.93l1.42-1.42C18.28 9.3 15.26 8 12 8s-6.28 1.3-8.49 3.51l1.42 1.42C6.74 11.12 9.24 10 12 10z" />
          </svg>
          <div className="flex items-center gap-0.5">
            <div className="relative h-2.5 w-5 rounded-sm border border-white/90">
              <div className="absolute inset-0.5 rounded-[1px] bg-white/90" />
            </div>
            <div className="h-1.5 w-0.5 rounded-r-sm bg-white/90" />
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeIndicator() {
  return (
    <div className="hidden justify-center bg-black py-1.5 shrink-0 md:flex">
      <div className="h-1 w-32 rounded-full bg-white/40" />
    </div>
  );
}

export function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh w-full bg-neutral-950 md:flex md:items-center md:justify-center md:py-10">
      <div className="flex h-dvh w-full flex-col overflow-hidden bg-black md:h-[880px] md:w-[440px] md:rounded-[3.5rem] md:border-[14px] md:border-neutral-800 md:shadow-2xl md:shadow-black/60">
        <StatusBar />
        <div className="scrollbar-hide relative z-0 flex-1 overflow-y-scroll overflow-x-clip">
          {children}
        </div>
        <HomeIndicator />
      </div>
    </div>
  );
}
