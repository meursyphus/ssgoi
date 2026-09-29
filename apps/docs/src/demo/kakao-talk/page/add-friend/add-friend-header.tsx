"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/lib/components/ui/input";
import { DemoBackLink } from "@/lib/components/demo-back-link";

export function AddFriendHeader({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <header className="sticky top-0 z-20 bg-white">
      <div className="relative flex h-12 items-center justify-center px-2">
        <DemoBackLink
          fallback="/demo/kakao-talk"
          aria-label="닫기"
          className="absolute left-2 flex h-9 w-9 items-center justify-center rounded-full text-neutral-800 active:bg-black/5"
        >
          <X className="h-5 w-5" strokeWidth={1.8} />
        </DemoBackLink>
        <h1 className="text-[16px] font-semibold text-neutral-900">
          친구 추가
        </h1>
      </div>
      <div className="px-4 pb-3 pt-1">
        <div className="flex h-10 items-center gap-2 rounded-xl bg-neutral-100 px-3">
          <Search className="h-4 w-4 flex-shrink-0 text-neutral-400" />
          <Input
            type="search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="이름 또는 카카오톡 ID"
            aria-label="이름 또는 카카오톡 ID"
            enterKeyHint="search"
            className="h-10 flex-1 border-0 bg-transparent px-0 text-[15px] text-neutral-900 shadow-none placeholder:text-neutral-400 focus-visible:ring-0"
          />
        </div>
      </div>
    </header>
  );
}
