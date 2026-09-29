"use client";

import { Download, EyeOff, Flag, type LucideIcon } from "lucide-react";
import { toast } from "sonner";

const OPTIONS: { label: string; icon: LucideIcon; done: string }[] = [
  { label: "이미지 다운로드", icon: Download, done: "이미지를 저장했어요" },
  {
    label: "핀 숨기기",
    icon: EyeOff,
    done: "이 핀과 비슷한 아이디어를 덜 보여드릴게요",
  },
  { label: "핀 신고하기", icon: Flag, done: "신고가 접수되었어요" },
];

export function OptionList() {
  return (
    <section
      aria-label="옵션"
      className="mt-6 border-t border-black/5 pt-2 pb-8"
    >
      {OPTIONS.map((option) => (
        <button
          key={option.label}
          type="button"
          onClick={() => toast(option.done, { duration: 1500 })}
          className="flex w-full items-center gap-4 px-5 py-3.5 text-left active:bg-neutral-50"
        >
          <option.icon className="h-5 w-5 text-black" strokeWidth={2.2} />
          <span className="text-[16px] font-semibold text-black">
            {option.label}
          </span>
        </button>
      ))}
    </section>
  );
}
