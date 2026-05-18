"use client";

import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import type { PinSimple } from "@/demo/pinterest/state/pin";

export function PinCard({ pin }: { pin: PinSimple }) {
  return (
    <Link
      href={`/demo/pinterest/feed/${pin.id}`}
      className="group relative block overflow-hidden rounded-2xl bg-neutral-100"
    >
      <div className="relative w-full" style={{ aspectRatio: pin.aspectRatio }}>
        <img
          src={pin.image}
          alt={pin.title}
          className="h-full w-full object-cover"
          data-zoom-exit-key={pin.id}
          data-zoom-radius="16"
        />
        <button
          type="button"
          aria-label="더보기"
          onClick={(e) => e.preventDefault()}
          className="absolute bottom-1.5 right-1.5 grid h-7 w-7 place-items-center rounded-full bg-white/80 text-black opacity-0 transition-opacity group-hover:opacity-100"
        >
          <MoreHorizontal className="h-4 w-4" strokeWidth={2.6} />
        </button>
      </div>
    </Link>
  );
}
