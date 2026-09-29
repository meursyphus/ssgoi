"use client";

import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Bookmark, Heart, MessageCircle, Send } from "lucide-react";
import type { ReelDetail } from "@/demo/instagram/state/post";
import { Pop } from "../shared/pop";

export function ReelActionRail({ reel }: { reel: ReelDetail }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  return (
    <div className="flex shrink-0 flex-col items-center gap-4">
      <RailButton
        label={liked ? "좋아요 취소" : "좋아요"}
        count={reel.likesLabel}
        onClick={() => setLiked((v) => !v)}
      >
        <Pop on={liked}>
          <Heart
            className={`h-7 w-7 ${liked ? "fill-red-500 text-red-500" : ""}`}
            strokeWidth={1.8}
          />
        </Pop>
      </RailButton>
      <RailButton
        label="댓글"
        count={reel.commentsLabel}
        onClick={() =>
          toast("릴스 댓글은 데모에서 지원하지 않아요", { duration: 1500 })
        }
      >
        <MessageCircle className="h-7 w-7" strokeWidth={1.8} />
      </RailButton>
      <RailButton
        label="공유"
        count={reel.sharesLabel}
        onClick={() => toast("링크를 복사했어요", { duration: 1500 })}
      >
        <Send className="h-[26px] w-[26px]" strokeWidth={1.8} />
      </RailButton>
      <RailButton
        label={saved ? "저장 취소" : "저장"}
        onClick={() => setSaved((v) => !v)}
      >
        <Pop on={saved}>
          <Bookmark
            className={`h-[26px] w-[26px] ${saved ? "fill-white" : ""}`}
            strokeWidth={1.8}
          />
        </Pop>
      </RailButton>
      <img
        src={reel.author.avatar}
        alt=""
        className="mt-1 h-7 w-7 rounded-md border-2 border-white object-cover"
      />
    </div>
  );
}

function RailButton({
  label,
  count,
  onClick,
  children,
}: {
  label: string;
  count?: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex w-12 flex-col items-center gap-1 drop-shadow"
    >
      {children}
      {count && <span className="text-[12px] font-medium">{count}</span>}
    </button>
  );
}
