"use client";

import { Link } from "@/lib/link";
import { useRef } from "react";
import { MoreHorizontal } from "lucide-react";
import { pinImageDimensions } from "@/demo/pinterest/api/pin/image";
import type { PinSimple } from "@/demo/pinterest/state/pin";
import { useHeroPrefetch } from "../shared/use-hero-prefetch";

export function PinCard({ pin }: { pin: PinSimple }) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const imageSize = pinImageDimensions(pin.aspectRatio, 800);

  useHeroPrefetch(linkRef, pin.image, pin.aspectRatio);

  return (
    <Link
      ref={linkRef}
      href={`/demo/pinterest/feed/${pin.id}`}
      scroll={false}
      className="group relative block overflow-hidden rounded-2xl bg-neutral-100"
      style={{ aspectRatio: pin.aspectRatio }}
      data-zoom-exit-key={pin.id}
    >
      <img
        src={pin.image}
        alt={pin.title}
        width={imageSize.width}
        height={imageSize.height}
        className="h-full w-full object-cover"
      />
      <button
        type="button"
        aria-label="더보기"
        onClick={(e) => e.preventDefault()}
        className="absolute bottom-1.5 right-1.5 grid h-7 w-7 place-items-center rounded-full bg-white/80 text-black opacity-0 transition-opacity group-hover:opacity-100"
      >
        <MoreHorizontal className="h-4 w-4" strokeWidth={2.6} />
      </button>
    </Link>
  );
}
