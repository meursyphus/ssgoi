"use client";

import { Plus, Smile, Hash, Mic } from "lucide-react";
import { Input } from "@/lib/components/ui/input";

export function Composer() {
  return (
    <div className="border-t border-black/5 bg-white px-2 py-2">
      <form
        className="flex items-center gap-1"
        onSubmit={(e) => e.preventDefault()}
      >
        <IconBtn label="첨부">
          <Plus className="h-5 w-5" />
        </IconBtn>
        <div className="flex-1">
          <Input
            type="text"
            placeholder="메시지 입력"
            className="h-9 rounded-full border border-neutral-200 bg-neutral-50 px-3 text-[13px]"
          />
        </div>
        <IconBtn label="이모티콘">
          <Smile className="h-[20px] w-[20px]" />
        </IconBtn>
        <IconBtn label="샵검색">
          <Hash className="h-[18px] w-[18px]" />
        </IconBtn>
        <IconBtn label="음성">
          <Mic className="h-[18px] w-[18px]" />
        </IconBtn>
      </form>
    </div>
  );
}

function IconBtn({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-neutral-500 hover:bg-black/5"
    >
      {children}
    </button>
  );
}
