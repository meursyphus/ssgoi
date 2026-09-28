"use client";

import type { Dispatch, RefObject, SetStateAction } from "react";
import { Input } from "@/lib/components/ui/input";

const QUICK_EMOJI = ["🥰", "🙌"];

export function CommentComposer({
  avatar,
  text,
  onTextChange,
  inputRef,
  className = "mt-3",
}: {
  avatar?: string;
  text: string;
  onTextChange: Dispatch<SetStateAction<string>>;
  inputRef: RefObject<HTMLInputElement | null>;
  className?: string;
}) {
  // 게시물 끝과 댓글 시트 하단, 어디서든 화면 맨 아래 줄 — 홈 인디케이터만큼 띄운다
  return (
    <div
      className={`flex items-center gap-2 border-t border-neutral-200 bg-white px-3 pt-3 pb-safe-3 ${className}`}
    >
      <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full bg-neutral-100">
        {avatar && (
          <img src={avatar} alt="me" className="h-full w-full object-cover" />
        )}
      </div>
      <Input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="댓글 달기..."
        aria-label="댓글 달기"
        className="h-auto flex-1 rounded-none border-0 bg-transparent px-0 py-0 text-[13px] shadow-none placeholder:text-neutral-400 focus-visible:ring-0 md:text-[13px]"
      />
      {QUICK_EMOJI.map((emoji) => (
        <button
          key={emoji}
          type="button"
          aria-label={`${emoji} 입력`}
          onClick={() => onTextChange((t) => t + emoji)}
          className="text-[18px] leading-none transition-transform active:scale-125"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
