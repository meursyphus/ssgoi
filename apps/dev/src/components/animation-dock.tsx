"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { HostAnimation } from "@ssgoi/core/internal";

const HostCtx = createContext<HostAnimation | null>(null);

export function SsgoiDebugProvider({ children }: { children: ReactNode }) {
  const ref = useRef<HostAnimation | null>(null);
  ref.current ??= new HostAnimation();
  return <HostCtx.Provider value={ref.current}>{children}</HostCtx.Provider>;
}

export function useSsgoiHost(): HostAnimation | null {
  return useContext(HostCtx);
}

function useHostSnapshot(host: HostAnimation | null) {
  const subscribe = (fn: () => void) => (host ? host.subscribe(fn) : () => {});
  const getSnapshot = () => {
    if (!host) return "idle";
    if (host.isAnimating) return host.isReversing ? "reversing" : "playing";
    if (host.isPaused) return "paused";
    if (host.isComplete) return "settled";
    return "idle";
  };
  return useSyncExternalStore(subscribe, getSnapshot, () => "idle");
}

export function AnimationDock() {
  const host = useSsgoiHost();
  const status = useHostSnapshot(host);
  const [rate, setRate] = useState(1);

  if (!host) return null;

  const setRateAndApply = (r: number) => {
    setRate(r);
    host.playbackRate = r;
  };

  const live = status === "playing" || status === "reversing";

  return (
    <div className="fixed bottom-4 left-1/2 z-[9999] -translate-x-1/2 select-none rounded-2xl border border-white/10 bg-black/80 px-3 py-2 text-xs text-white shadow-xl backdrop-blur">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => host.pause()}
          className="rounded-md bg-white/5 px-2 py-1 hover:bg-white/10 disabled:opacity-40"
          disabled={!live}
          title="Pause"
        >
          ⏸
        </button>
        <button
          type="button"
          onClick={() => host.play()}
          className="rounded-md bg-white/5 px-2 py-1 hover:bg-white/10"
          title="Play forward"
        >
          ▶
        </button>
        <button
          type="button"
          onClick={() => host.reverse()}
          className="rounded-md bg-white/5 px-2 py-1 hover:bg-white/10"
          title="Reverse"
        >
          ◀
        </button>
        <button
          type="button"
          onClick={() => host.complete()}
          className="rounded-md bg-white/5 px-2 py-1 hover:bg-white/10 disabled:opacity-40"
          disabled={!live && !host.isPaused}
          title="Jump to end"
        >
          ⏭
        </button>

        <div className="mx-1 h-5 w-px bg-white/10" />

        <input
          type="range"
          min={0}
          max={2}
          step={0.05}
          value={rate}
          onChange={(e) => setRateAndApply(+e.target.value)}
          className="h-1 w-28 cursor-pointer accent-white/80"
        />
        <span className="w-10 text-right tabular-nums text-white/80">
          {rate.toFixed(2)}x
        </span>

        <div className="mx-1 h-5 w-px bg-white/10" />

        <span
          className={
            "min-w-[64px] rounded-md px-2 py-0.5 text-center text-[10px] uppercase tracking-wider " +
            (status === "playing"
              ? "bg-emerald-500/20 text-emerald-200"
              : status === "reversing"
                ? "bg-amber-500/20 text-amber-200"
                : status === "paused"
                  ? "bg-sky-500/20 text-sky-200"
                  : status === "settled"
                    ? "bg-white/10 text-white/60"
                    : "bg-white/5 text-white/40")
          }
        >
          {status}
        </span>
      </div>
    </div>
  );
}
