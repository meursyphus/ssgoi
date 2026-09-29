import { useState } from "react";
import { Minus, Plus } from "lucide-react";

export function WhoCard({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <section className="rounded-2xl bg-white shadow-[0_2px_10px_-6px_rgba(0,0,0,0.2)]">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-[14px] text-neutral-500">Who</span>
        <span className="text-[14px] font-semibold text-neutral-900">
          {value
            ? `${value} ${value === 1 ? "guest" : "guests"}`
            : "Add guests"}
        </span>
      </button>
      {open && (
        <div className="flex items-center justify-between px-5 pb-5">
          <div>
            <p className="text-[15px] font-medium text-neutral-900">Adults</p>
            <p className="text-[12px] text-neutral-500">Ages 13 or above</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Fewer adults"
              disabled={value === 0}
              onClick={() => onChange(value - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 disabled:opacity-30"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-4 text-center text-[15px] tabular-nums text-neutral-900">
              {value}
            </span>
            <button
              type="button"
              aria-label="More adults"
              disabled={value === 8}
              onClick={() => onChange(value + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 disabled:opacity-30"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
