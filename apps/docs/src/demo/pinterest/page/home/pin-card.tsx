"use client";

import Link from "next/link";
import type { PinSimple } from "@/demo/pinterest/state/pin";

export function PinCard({ pin }: { pin: PinSimple }) {
  return (
    <Link
      href={`/demo/pinterest/feed/${pin.id}`}
      className="block overflow-hidden rounded-2xl bg-neutral-900"
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: pin.aspectRatio }}
      >
        <img
          src={pin.image}
          alt={pin.title}
          className="h-full w-full object-cover"
          data-zoom-exit-key={pin.id}
        />
      </div>
      {pin.title ? (
        <p className="px-1 pt-1.5 pb-2 line-clamp-2 text-[12px] font-medium leading-snug text-white">
          {pin.title}
        </p>
      ) : null}
    </Link>
  );
}
