import { useState } from "react";

export type DateChoice = "weekend" | "week" | "month";

const CHOICES: Array<{ key: DateChoice; label: string }> = [
  { key: "weekend", label: "Weekend" },
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
];

export function WhenCard({
  value,
  onChange,
}: {
  value: DateChoice | null;
  onChange: (value: DateChoice) => void;
}) {
  const [open, setOpen] = useState(false);
  const label = CHOICES.find((c) => c.key === value)?.label;
  return (
    <section className="rounded-2xl bg-white shadow-[0_2px_10px_-6px_rgba(0,0,0,0.2)]">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-[14px] text-neutral-500">When</span>
        <span className="text-[14px] font-semibold text-neutral-900">
          {label ? `Any ${label.toLowerCase()}` : "Add dates"}
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5">
          <p className="text-[13px] text-neutral-500">
            How long would you like to stay?
          </p>
          <div className="flex gap-2 pt-2">
            {CHOICES.map((c) => (
              <button
                key={c.key}
                type="button"
                aria-pressed={value === c.key}
                onClick={() => onChange(c.key)}
                className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
                  value === c.key
                    ? "border-neutral-900 bg-neutral-50 text-neutral-900"
                    : "border-neutral-200 text-neutral-700"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
