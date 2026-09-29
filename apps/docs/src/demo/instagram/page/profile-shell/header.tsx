"use client";

import { Link } from "@/lib/link";
import type { Highlight, ProfileMe } from "@/demo/instagram/state/profile";

const BASE = "/demo/instagram";

export function ProfileHeader({ me }: { me: ProfileMe }) {
  return (
    <div className="bg-white pb-2">
      {/* avatar + stats row */}
      <div className="flex items-start gap-6 px-4 pt-4">
        <AvatarWithStory
          avatar={me.avatar}
          name={me.name}
          storyId={me.username}
        />
        <div className="mt-1 flex flex-1 items-center justify-around">
          <Stat label="게시물" value={me.postsLabel} />
          <Stat
            label="팔로워"
            value={me.followersLabel}
            href={`${BASE}/follows/followers`}
          />
          <Stat
            label="팔로잉"
            value={me.followingLabel}
            href={`${BASE}/follows/following`}
          />
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

function Stat({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const body = (
    <>
      <span className="text-[15px] font-semibold leading-tight text-neutral-900">
        {value}
      </span>
      <span className="mt-0.5 text-[12px] text-neutral-700">{label}</span>
    </>
  );
  if (!href) return <div className="flex flex-col items-center">{body}</div>;
  return (
    <Link
      href={href}
      scroll={false}
      className="flex flex-col items-center rounded-md px-1 active:opacity-50"
    >
      {body}
    </Link>
  );
}

function AvatarWithStory({
  avatar,
  name,
  storyId,
}: {
  avatar: string;
  name: string;
  storyId: string;
}) {
  return (
    <div className="relative shrink-0">
      <Link
        href={`${BASE}/stories/${storyId}`}
        scroll={false}
        aria-label="내 스토리 보기"
        className="block rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px] active:scale-95 transition-transform"
      >
        <div className="rounded-full bg-white p-[2px]">
          <img
            src={avatar}
            alt={name}
            width={78}
            height={78}
            className="h-[78px] w-[78px] rounded-full object-cover"
          />
        </div>
      </Link>
      <Link
        href={`${BASE}/create`}
        scroll={false}
        aria-label="스토리 추가"
        className="absolute -bottom-0.5 -right-0.5 grid h-[22px] w-[22px] place-items-center rounded-full border-2 border-white bg-neutral-900 text-white"
      >
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
      </Link>
    </div>
  );
}

function HighlightNew() {
  return (
    <Link
      href={`${BASE}/create`}
      scroll={false}
      className="flex w-[68px] shrink-0 flex-col items-center gap-1 active:opacity-60"
    >
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
    </Link>
  );
}

function HighlightItem({ highlight }: { highlight: Highlight }) {
  const storyId = `hl-${highlight.id}`;
  return (
    <Link
      href={`${BASE}/stories/${storyId}`}
      scroll={false}
      className="flex w-[68px] shrink-0 flex-col items-center gap-1 active:opacity-60"
    >
      <div className="h-[64px] w-[64px] rounded-full border border-neutral-200 p-[2px]">
        <img
          src={highlight.cover}
          alt={highlight.label}
          width={58}
          height={58}
          className="h-full w-full rounded-full object-cover"
        />
      </div>
      <span className="max-w-full truncate text-[11px] text-neutral-800">
        {highlight.label}
      </span>
    </Link>
  );
}
