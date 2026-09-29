"use client";

import { useState } from "react";
import {
  Download,
  ListPlus,
  Share2,
  ThumbsDown,
  ThumbsUp,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { compactCount, type MockVideo } from "../../mock-data";

const PILLS: { label: string; icon: LucideIcon; toast: string }[] = [
  { label: "Share", icon: Share2, toast: "Link copied" },
  { label: "Download", icon: Download, toast: "Downloading in 720p" },
  { label: "Save", icon: ListPlus, toast: "Saved to Watch later" },
];

const pill =
  "flex h-9 shrink-0 items-center gap-2 rounded-full bg-neutral-100 px-3.5 text-[13px] font-semibold active:bg-neutral-200";

/** Like/Dislike toggles in place; the other pills confirm with a toast. */
export function ActionRow({ video }: { video: MockVideo }) {
  const [reaction, setReaction] = useState<"like" | "dislike" | null>(null);
  const likes = video.likes + (reaction === "like" ? 1 : 0);
  const toggle = (next: "like" | "dislike") =>
    setReaction(reaction === next ? null : next);

  return (
    <section className="scrollbar-hide flex gap-2 overflow-x-auto px-3 pt-4">
      <div className="flex h-9 shrink-0 items-center rounded-full bg-neutral-100 text-[13px] font-semibold">
        <button
          type="button"
          aria-label="Like"
          aria-pressed={reaction === "like"}
          onClick={() => toggle("like")}
          className="flex h-full items-center gap-2 rounded-l-full pl-3.5 pr-3 active:bg-neutral-200"
        >
          <ThumbsUp
            className={`h-[18px] w-[18px] transition-transform duration-150 ${
              reaction === "like" ? "scale-110" : ""
            }`}
            fill={reaction === "like" ? "currentColor" : "none"}
          />
          {compactCount(likes)}
        </button>
        <span className="h-5 w-px bg-neutral-300" />
        <button
          type="button"
          aria-label="Dislike"
          aria-pressed={reaction === "dislike"}
          onClick={() => toggle("dislike")}
          className="flex h-full items-center rounded-r-full pl-3 pr-3.5 active:bg-neutral-200"
        >
          <ThumbsDown
            className="h-[18px] w-[18px]"
            fill={reaction === "dislike" ? "currentColor" : "none"}
          />
        </button>
      </div>
      {PILLS.map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={() => toast(item.toast)}
          className={pill}
        >
          <item.icon className="h-[18px] w-[18px]" />
          {item.label}
        </button>
      ))}
    </section>
  );
}
