"use client";

import type { Highlight, ProfileMe } from "@/demo/instagram/state/profile";

export function ProfileHeader({ me }: { me: ProfileMe }) {
  return (
    <div className="bg-white pb-2">
      {/* avatar + stats row */}
      <div className="flex items-start gap-6 px-4 pt-4">
        <AvatarWithStory
          avatar={me.avatar}
          name={me.name}
          bubble={me.speechBubble}
        />
        <div className="mt-1 flex flex-1 items-center justify-around">
          <Stat label="게시물" value={me.postsLabel} />
          <Stat label="팔로워" value={me.followersLabel} />
          <Stat label="팔로잉" value={me.followingLabel} />
        </div>
      </div>

      {/* display name + bio */}
      <div className="mt-2 px-4">
        <p className="text-[14px] font-semibold leading-tight text-neutral-900">
          {me.name}
        </p>
        <p className="mt-0.5 whitespace-pre-line text-[13px] leading-snug text-neutral-700">
          {me.bio}
        </p>
      </div>

      {/* action buttons */}
      <div className="mt-3 flex items-center gap-1.5 px-4">
        <button className="h-8 flex-1 rounded-lg bg-neutral-100 text-[13px] font-semibold text-neutral-900 active:bg-neutral-200">
          프로필 편집
        </button>
        <button className="h-8 flex-1 rounded-lg bg-neutral-100 text-[13px] font-semibold text-neutral-900 active:bg-neutral-200">
          프로필 공유
        </button>
        <button className="grid h-8 w-9 place-items-center rounded-lg bg-neutral-100 active:bg-neutral-200">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M16 11V8m0 0V5m0 3h-3m3 0h3" strokeLinecap="round" />
            <path d="M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
            <path d="M2 21v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1" />
          </svg>
        </button>
      </div>

      {/* highlights */}
      <div className="mt-4 flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide">
        <HighlightNew />
        {me.highlights.map((h) => (
          <HighlightItem key={h.id} highlight={h} />
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[15px] font-semibold leading-tight text-neutral-900">
        {value}
      </span>
      <span className="mt-0.5 text-[12px] text-neutral-700">{label}</span>
    </div>
  );
}

function AvatarWithStory({
  avatar,
  name,
  bubble,
}: {
  avatar: string;
  name: string;
  bubble: string;
}) {
  return (
    <div className="relative shrink-0">
      <div className="rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
        <div className="rounded-full bg-white p-[2px]">
          <img
            src={avatar}
            alt={name}
            className="h-[78px] w-[78px] rounded-full object-cover"
          />
        </div>
      </div>
      <div className="absolute -bottom-0.5 -right-0.5 grid h-[22px] w-[22px] place-items-center rounded-full border-2 border-white bg-neutral-900 text-white">
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.8"
        >
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
      </div>
      {/* speech bubble */}
      <div className="absolute -right-2 -top-3 -translate-y-1/2 translate-x-full whitespace-pre rounded-2xl rounded-bl-sm bg-neutral-100 px-2.5 py-1.5 text-[10px] leading-tight text-neutral-700 shadow-sm">
        {bubble}
      </div>
    </div>
  );
}

function HighlightNew() {
  return (
    <div className="flex w-[68px] shrink-0 flex-col items-center gap-1">
      <div className="grid h-[64px] w-[64px] place-items-center rounded-full border border-neutral-300 bg-white">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
      </div>
      <span className="max-w-full truncate text-[11px] text-neutral-800">
        New
      </span>
    </div>
  );
}

function HighlightItem({ highlight }: { highlight: Highlight }) {
  return (
    <div className="flex w-[68px] shrink-0 flex-col items-center gap-1">
      <div className="h-[64px] w-[64px] rounded-full border border-neutral-200 p-[2px]">
        <img
          src={highlight.cover}
          alt={highlight.label}
          className="h-full w-full rounded-full object-cover"
        />
      </div>
      <span className="max-w-full truncate text-[11px] text-neutral-800">
        {highlight.label}
      </span>
    </div>
  );
}
