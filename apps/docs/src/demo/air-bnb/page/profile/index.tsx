"use client";

import { Heart, Luggage } from "lucide-react";
import { Link } from "@/lib/link";
import { routes } from "@/demo/air-bnb/page/shared/routes";

const TILES = [
  { href: routes.trips, label: "Past trips", Icon: Luggage },
  { href: routes.wishlists, label: "Wishlists", Icon: Heart },
];

export default function ProfilePage() {
  return (
    <div className="flex-1 bg-white px-5 pb-10 pt-8">
      <h1 className="text-[30px] font-bold text-neutral-900">Profile</h1>
      <div className="mt-6 flex flex-col items-center rounded-3xl bg-white py-7 shadow-[0_8px_28px_-10px_rgba(0,0,0,0.22)]">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-neutral-900 text-[40px] font-semibold text-white">
          D
        </div>
        <p className="pt-3 text-[26px] font-bold text-neutral-900">Daeseung</p>
        <p className="text-[13px] text-neutral-500">Guest · Seoul</p>
      </div>
      <div className="grid grid-cols-2 gap-3 pt-4">
        {TILES.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            scroll={false}
            className="flex flex-col gap-6 rounded-3xl bg-white p-4 shadow-[0_8px_28px_-10px_rgba(0,0,0,0.22)] active:scale-[0.98]"
          >
            <Icon className="h-9 w-9 text-neutral-800" strokeWidth={1.6} />
            <span className="text-[15px] font-semibold text-neutral-900">
              {label}
            </span>
          </Link>
        ))}
      </div>
      <p className="pt-8 text-center text-[11px] text-neutral-400">
        Airbnb · Version 25.24
      </p>
    </div>
  );
}
