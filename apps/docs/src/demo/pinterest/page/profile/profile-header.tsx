"use client";

import type { Profile } from "@/demo/pinterest/state/pin";
import { PinterestGlyph } from "../shared/pinterest-glyph";

export function ProfileHeader({ profile }: { profile: Profile }) {
  return (
    <header className="flex flex-col items-center px-4 pt-10 pb-5 text-center">
      <img
        src={profile.avatar}
        alt={profile.name}
        width={192}
        height={192}
        className="h-24 w-24 rounded-full bg-neutral-200 object-cover"
      />
      <h1 className="mt-3 text-[28px] font-bold leading-tight tracking-tight text-black">
        {profile.name}
      </h1>
      <p className="mt-1 flex items-center gap-1 text-[14px] text-neutral-600">
        <PinterestGlyph size={14} className="text-neutral-500" />
        {profile.handle}
      </p>
      <p className="mt-2 text-[14px] text-black">
        <span className="font-semibold">팔로워 {profile.followers}명</span>
        <span className="mx-1.5 text-neutral-400">·</span>
        <span className="font-semibold">팔로잉 {profile.following}명</span>
      </p>
    </header>
  );
}
