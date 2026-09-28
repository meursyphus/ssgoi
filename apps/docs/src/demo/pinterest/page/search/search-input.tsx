"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, Camera } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/lib/components/ui/input";

export function SearchInput({
  active,
  onActiveChange,
}: {
  active: boolean;
  onActiveChange: (active: boolean) => void;
}) {
  const router = useRouter();
  const [text, setText] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    const query = text.trim();
    if (!query) return;
    router.push(`/demo/pinterest/search/${encodeURIComponent(query)}`, {
      scroll: false,
    });
  }

  return (
    <div className="bg-white px-4 pt-3 pb-3">
      <div className="flex items-center gap-3">
        <form
          role="search"
          onSubmit={submit}
          className="flex flex-1 items-center gap-2 rounded-full bg-white px-4 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] ring-1 ring-black/5"
        >
          <Search className="h-4 w-4 shrink-0 text-black" strokeWidth={2.6} />
          <Input
            type="text"
            inputMode="search"
            enterKeyHint="search"
            aria-label="Pinterest 검색"
            placeholder="Pinterest 검색"
            value={text}
            onChange={(event) => setText(event.target.value)}
            onFocus={() => onActiveChange(true)}
            className="h-6 flex-1 rounded-none border-0 bg-transparent p-0 text-[16px] text-black shadow-none placeholder:text-neutral-500 focus-visible:ring-0 md:text-[16px]"
          />
          <button
            type="button"
            aria-label="카메라"
            onClick={() =>
              toast("Lens 검색은 Pinterest 앱에서 사용할 수 있어요", {
                duration: 1500,
              })
            }
            className="grid h-7 w-7 shrink-0 place-items-center text-black"
          >
            <Camera className="h-5 w-5" strokeWidth={2.2} />
          </button>
        </form>
        {active && (
          <button
            type="button"
            onClick={() => {
              setText("");
              onActiveChange(false);
            }}
            className="shrink-0 text-[15px] font-semibold text-black"
          >
            취소
          </button>
        )}
      </div>
      {active && text.trim() && (
        <button
          type="button"
          onClick={submit}
          className="mt-3 flex w-full items-center gap-3 rounded-xl px-1 py-2 text-left active:bg-neutral-100"
        >
          <Search className="h-4 w-4 text-neutral-500" strokeWidth={2.6} />
          <span className="flex-1 truncate text-[16px] font-semibold text-black">
            {text.trim()}
          </span>
        </button>
      )}
    </div>
  );
}
