"use client";

import { LayoutGrid, Pin, Scissors, type LucideIcon } from "lucide-react";
import { toast } from "sonner";

const OPTIONS: { label: string; icon: LucideIcon; hint: string }[] = [
  { label: "핀", icon: Pin, hint: "아래에서 사진을 골라 핀을 만들어 보세요" },
  {
    label: "콜라주",
    icon: Scissors,
    hint: "콜라주는 Pinterest 앱에서 만들 수 있어요",
  },
  {
    label: "보드",
    icon: LayoutGrid,
    hint: "새 보드는 데모에서 만들 수 없어요",
  },
];

export function CreateOptions() {
  return (
    <div className="flex justify-center gap-6 px-4 pt-4 pb-6">
      {OPTIONS.map((option) => (
        <button
          key={option.label}
          type="button"
          onClick={() => toast(option.hint, { duration: 1500 })}
          className="flex flex-col items-center gap-2"
        >
          <span className="grid h-[84px] w-[84px] place-items-center rounded-3xl bg-neutral-100 text-black transition-transform active:scale-95">
            <option.icon className="h-8 w-8" strokeWidth={2.2} />
          </span>
          <span className="text-[13px] font-semibold text-black">
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
}
