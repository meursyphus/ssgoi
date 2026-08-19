import { Play } from "lucide-react";

export function YouTubeBrand({ inverse = false }: { inverse?: boolean }) {
  return (
    <div
      className={`flex items-center gap-1.5 text-[20px] font-bold tracking-[-0.04em] ${
        inverse ? "text-white" : "text-neutral-950"
      }`}
      aria-label="YouTube"
    >
      <span className="flex h-[22px] w-[32px] items-center justify-center rounded-[7px] bg-[#ff0033] text-white">
        <Play className="ml-0.5 h-3.5 w-3.5" fill="currentColor" />
      </span>
      <span>YouTube</span>
    </div>
  );
}

export function ShortsMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M8.8 3.2a3 3 0 0 1 3.9-1.65l4.5 2.15a3 3 0 0 1 .35 5.2l-2.2 1.42 1.85.88a3 3 0 0 1 .35 5.2l-6.35 4.1A3 3 0 0 1 6.7 17.1l2.2-1.42-1.85-.88a3 3 0 0 1-.35-5.2l2.2-1.42-.1-4.98Zm1.98 7.08v4.25l3.7-2.12-3.7-2.13Z" />
    </svg>
  );
}
