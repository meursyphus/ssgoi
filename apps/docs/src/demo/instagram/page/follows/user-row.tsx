"use client";

import { useState } from "react";
import type { FollowUser } from "@/demo/instagram/state/profile";

export function UserRow({ user }: { user: FollowUser }) {
  const [following, setFollowing] = useState(user.isFollowing);
  return (
    <div className="flex items-center gap-3 px-4 py-2">
      <div
        className={`shrink-0 rounded-full p-[2px] ${
          user.hasStory
            ? "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600"
            : ""
        }`}
      >
        <div className="rounded-full bg-white p-[2px]">
          <img
            src={user.avatar}
            alt={user.username}
            className="h-12 w-12 rounded-full object-cover"
          />
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-semibold">{user.username}</p>
        <p className="truncate text-[14px] text-neutral-500">{user.name}</p>
      </div>
      <button
        type="button"
        aria-pressed={following}
        onClick={() => setFollowing((v) => !v)}
        className={`h-8 w-[88px] shrink-0 rounded-lg text-[13px] font-semibold transition-colors active:scale-95 ${
          following
            ? "bg-neutral-100 text-neutral-900"
            : "bg-sky-500 text-white"
        }`}
      >
        {following ? "팔로잉" : "팔로우"}
      </button>
    </div>
  );
}
