"use client";

export type CreateMode = "post" | "story" | "reel";

const MODES: { key: CreateMode; label: string }[] = [
  { key: "post", label: "게시물" },
  { key: "story", label: "스토리" },
  { key: "reel", label: "릴스" },
];

export function CreateModeSwitch({
  mode,
  onChange,
}: {
  mode: CreateMode;
  onChange: (mode: CreateMode) => void;
}) {
  return (
    <div className="pointer-events-none sticky bottom-5 z-20 -mt-14 flex justify-center">
      <div className="pointer-events-auto flex gap-1 rounded-full bg-neutral-800/90 p-1 backdrop-blur">
        {MODES.map((m) => (
          <button
            key={m.key}
            type="button"
            aria-pressed={m.key === mode}
            onClick={() => onChange(m.key)}
            className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors ${
              m.key === mode ? "bg-neutral-600 text-white" : "text-white/60"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
