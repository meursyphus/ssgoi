"use client";

import { useState } from "react";
import { Globe2 } from "lucide-react";
import { Link } from "@/lib/link";
import type { ActivityItem } from "@/demo/voyage/state/story";
import { BASE } from "../shared/routes";

function Avatar({ item }: { item: ActivityItem }) {
  if (item.kind === "reminder") {
    return (
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FF5A5F] text-white">
        <Globe2 size={20} strokeWidth={2.5} />
      </span>
    );
  }
  return (
    <span
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[15px] font-semibold text-white ${item.actorColor}`}
    >
      {item.actorInitial}
    </span>
  );
}

function Message({ item }: { item: ActivityItem }) {
  return (
    <div className="min-w-0 flex-1">
      <p className="text-[14px] leading-snug text-neutral-700">
        {item.kind !== "reminder" && (
          <span className="font-semibold text-neutral-900">{item.actor} </span>
        )}
        {item.text}
        {item.storyTitle && (
          <span className="font-semibold text-neutral-900">
            {" "}
            “{item.storyTitle}”
          </span>
        )}
      </p>
      {item.quote && (
        <p className="mt-1 line-clamp-2 border-l-2 border-neutral-200 pl-2 text-[13px] text-neutral-500">
          {item.quote}
        </p>
      )}
      <div className="mt-1 flex items-center gap-1.5 text-[12px] text-neutral-400">
        {item.timeLabel}
        {item.isNew && (
          <span
            className="h-1.5 w-1.5 rounded-full bg-[#FF5A5F]"
            aria-label="New"
          />
        )}
      </div>
    </div>
  );
}

function FollowButton() {
  const [following, setFollowing] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setFollowing((v) => !v)}
      aria-pressed={following}
      className={`shrink-0 rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition-colors active:scale-95 ${
        following
          ? "bg-neutral-100 text-neutral-700"
          : "bg-[#FF5A5F] text-white"
      }`}
    >
      {following ? "Following" : "Follow back"}
    </button>
  );
}

export function ActivityRow({ item }: { item: ActivityItem }) {
  if (item.kind === "follow" || !item.storyId) {
    return (
      <div className="flex items-center gap-3 px-5 py-3">
        <Avatar item={item} />
        <Message item={item} />
        <FollowButton />
      </div>
    );
  }
  return (
    <Link
      href={`${BASE}/story/${item.storyId}`}
      scroll={false}
      className="flex items-start gap-3 px-5 py-3 active:bg-neutral-50"
    >
      <Avatar item={item} />
      <Message item={item} />
      {item.storyCover && (
        <img
          src={item.storyCover}
          alt=""
          width={88}
          height={110}
          loading="lazy"
          className="h-[55px] w-11 shrink-0 rounded-lg object-cover"
        />
      )}
    </Link>
  );
}
