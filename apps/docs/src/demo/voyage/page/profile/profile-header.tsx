"use client";

import { MapPin } from "lucide-react";
import type { Profile } from "@/demo/voyage/state/story";

export function ProfileHeader({ profile }: { profile: Profile }) {
  return (
    <section className="px-5 pt-2">
      <div className="flex items-center gap-4">
        <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[20px] font-semibold text-white">
          You
        </span>
        <div className="min-w-0">
          <div className="text-[21px] font-extrabold tracking-tight text-neutral-900">
            {profile.name}
          </div>
          <div className="mt-0.5 flex items-center gap-1 text-[13px] text-neutral-500">
            {profile.handle}
            <span className="px-0.5 text-neutral-300">·</span>
            <MapPin size={13} strokeWidth={2.5} className="text-[#FF5A5F]" />
            {profile.city}
          </div>
        </div>
      </div>
      <p className="mt-4 text-[14.5px] leading-relaxed text-neutral-700">
        {profile.bio}
      </p>
      <dl className="mt-5 grid grid-cols-3 rounded-2xl bg-neutral-50 py-3.5">
        {profile.stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center border-neutral-200 [&:not(:first-child)]:border-l"
          >
            <dt className="order-2 text-[12px] text-neutral-500">
              {stat.label}
            </dt>
            <dd className="text-[18px] font-bold tracking-tight text-neutral-900">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
