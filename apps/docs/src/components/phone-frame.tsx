type Props = {
  src: string;
  title?: string;
};

export function PhoneFrame({ src, title = "Live demo" }: Props) {
  return (
    <div className="relative mx-auto w-[320px] shrink-0 sm:w-[380px] lg:w-[420px]">
      <div className="relative aspect-[320/660] rounded-[52px] bg-gradient-to-b from-[#1c1611] to-[#0f0b08] p-[12px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.04)_inset]">
        <div className="pointer-events-none absolute inset-[12px] rounded-[42px] ring-1 ring-white/5" />
        <div className="relative h-full w-full overflow-hidden rounded-[40px] bg-white">
          <StatusBar />
          <iframe
            src={src}
            title={title}
            loading="lazy"
            className="h-[calc(100%-44px)] w-full border-0 bg-white"
          />
        </div>
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="relative z-10 flex h-11 w-full items-center justify-between bg-white px-7 pt-1.5 text-[13px] font-semibold text-neutral-900">
      <span className="tabular-nums">9:41</span>
      <div className="pointer-events-none absolute left-1/2 top-1.5 h-7 w-[100px] -translate-x-1/2 rounded-full bg-black" />
      <div className="flex items-center gap-1.5">
        <SignalIcon />
        <WifiIcon />
        <BatteryIcon />
      </div>
    </div>
  );
}

function SignalIcon() {
  return (
    <svg viewBox="0 0 18 12" className="h-[10px] w-[18px]" aria-hidden>
      <rect x="0" y="8" width="3" height="4" rx="0.5" fill="currentColor" />
      <rect x="5" y="6" width="3" height="6" rx="0.5" fill="currentColor" />
      <rect x="10" y="3" width="3" height="9" rx="0.5" fill="currentColor" />
      <rect x="15" y="0" width="3" height="12" rx="0.5" fill="currentColor" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg viewBox="0 0 16 12" className="h-[11px] w-[15px]" aria-hidden>
      <path
        d="M8 11.2a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Zm0-4.2a3.4 3.4 0 0 1 2.4 1l-1 1a2 2 0 0 0-2.8 0l-1-1A3.4 3.4 0 0 1 8 7Zm0-3a6.3 6.3 0 0 1 4.5 1.9l-1 1A4.9 4.9 0 0 0 8 5.4a4.9 4.9 0 0 0-3.5 1.5l-1-1A6.3 6.3 0 0 1 8 4Zm0-3a9.2 9.2 0 0 1 6.6 2.8l-1 1A7.8 7.8 0 0 0 8 2.4 7.8 7.8 0 0 0 2.4 4.8l-1-1A9.2 9.2 0 0 1 8 1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg viewBox="0 0 26 12" className="h-[12px] w-[26px]" aria-hidden>
      <rect
        x="0.5"
        y="0.5"
        width="22"
        height="11"
        rx="2.5"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.35"
      />
      <rect
        x="23.5"
        y="3.5"
        width="1.6"
        height="5"
        rx="0.4"
        fill="currentColor"
        fillOpacity="0.35"
      />
      <rect x="2" y="2" width="18" height="8" rx="1.4" fill="currentColor" />
    </svg>
  );
}
