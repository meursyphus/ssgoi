"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, Search, XCircle } from "lucide-react";
import { Input } from "@/lib/components/ui/input";
import { DemoBackLink } from "@/lib/components/demo-back-link";

export function SearchHeader({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus without letting the browser scroll the frame mid-transition.
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-1 bg-white pl-1 pr-3">
      <DemoBackLink
        fallback="/demo/kakao-talk"
        aria-label="뒤로"
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-neutral-800 active:bg-black/5"
      >
        <ChevronLeft className="h-6 w-6" strokeWidth={1.8} />
      </DemoBackLink>
      <div className="flex h-9 flex-1 items-center gap-1.5 rounded-xl bg-neutral-100 px-2.5">
        <Search className="h-4 w-4 flex-shrink-0 text-neutral-400" />
        <Input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="이름, 채팅방 검색"
          aria-label="검색어"
          enterKeyHint="search"
          className="h-9 flex-1 border-0 bg-transparent px-0 text-[15px] text-neutral-900 shadow-none placeholder:text-neutral-400 focus-visible:ring-0 [&::-webkit-search-cancel-button]:hidden"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="검색어 지우기"
            className="flex h-6 w-6 flex-shrink-0 items-center justify-center text-neutral-400 active:text-neutral-600"
          >
            <XCircle className="h-4 w-4 fill-neutral-300 text-white" />
          </button>
        )}
      </div>
    </header>
  );
}
