"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Eye, Heart, Send } from "lucide-react";
import { Input } from "@/lib/components/ui/input";
import type { StoryDetail } from "@/demo/instagram/state/profile";
import { Pop } from "../shared/pop";

export function StoryReplyBar({ story }: { story: StoryDetail }) {
  const [liked, setLiked] = useState(false);
  if (story.isMine) {
    return (
      <div className="absolute inset-x-0 bottom-safe flex h-16 items-center gap-2 px-4 text-[13px] text-white/85">
        {story.viewersLabel ? (
          <>
            <Eye className="h-5 w-5" strokeWidth={1.8} />
            <span>{story.viewersLabel}</span>
          </>
        ) : (
          <span className="text-white/60">하이라이트</span>
        )}
      </div>
    );
  }
  return (
    <div className="absolute inset-x-0 bottom-safe flex h-16 items-center gap-3 px-3">
      <Input
        type="text"
        placeholder="메시지 보내기"
        aria-label="메시지 보내기"
        className="h-11 flex-1 rounded-full border-white/50 bg-transparent px-4 text-[14px] text-white placeholder:text-white/80 focus-visible:ring-0 md:text-[14px]"
      />
      <button
        type="button"
        aria-label={liked ? "좋아요 취소" : "좋아요"}
        aria-pressed={liked}
        onClick={() => setLiked((v) => !v)}
        className="grid h-10 w-9 place-items-center"
      >
        <Pop on={liked}>
          <Heart
            className={`h-7 w-7 ${liked ? "fill-red-500 text-red-500" : ""}`}
            strokeWidth={1.8}
          />
        </Pop>
      </button>
      <button
        type="button"
        aria-label="공유"
        onClick={() =>
          toast(`${story.label}님의 스토리를 공유했어요`, { duration: 1500 })
        }
        className="grid h-10 w-9 place-items-center"
      >
        <Send className="h-[26px] w-[26px]" strokeWidth={1.8} />
      </button>
    </div>
  );
}
