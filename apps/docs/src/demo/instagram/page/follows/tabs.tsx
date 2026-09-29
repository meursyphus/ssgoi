"use client";

import type { FollowTab } from "@/demo/instagram/state/profile";

export function FollowsTabs({
  tab,
  followersLabel,
  followingLabel,
  onChange,
}: {
  tab: FollowTab;
  followersLabel: string;
  followingLabel: string;
  onChange: (tab: FollowTab) => void;
}) {
  const items: { key: FollowTab; label: string }[] = [
    { key: "followers", label: `팔로워 ${followersLabel}` },
    { key: "following", label: `팔로잉 ${followingLabel}` },
  ];
  return (
    <div className="relative grid grid-cols-2 border-b border-neutral-200">
      {items.map((it) => (
        <button
          key={it.key}
          type="button"
          aria-pressed={it.key === tab}
          onClick={() => onChange(it.key)}
          className={`h-11 text-[14px] font-semibold transition-colors ${
            it.key === tab ? "text-neutral-900" : "text-neutral-400"
          }`}
        >
          {it.label}
        </button>
      ))}
      <span
        className={`absolute bottom-0 left-0 h-px w-1/2 bg-neutral-900 transition-transform duration-200 ease-out ${
          tab === "following" ? "translate-x-full" : "translate-x-0"
        }`}
      />
    </div>
  );
}
