"use client";

import { Link } from "@/lib/link";
import { useEffect, useRef } from "react";
import { MoreHorizontal } from "lucide-react";
import {
  pinImageDimensions,
  pinImageUrl,
} from "@/demo/pinterest/api/pin/image";
import type { PinSimple } from "@/demo/pinterest/state/pin";

export function PinCard({ pin }: { pin: PinSimple }) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const imageSize = pinImageDimensions(pin.aspectRatio, 800);

  useEffect(() => {
    const el = linkRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const conn = (navigator as { connection?: { saveData?: boolean } })
      .connection;
    if (conn?.saveData) return;

    let idleHandle: number | undefined;
    let timeoutHandle: number | undefined;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const fire = () => {
          const img = new Image();
          img.src = pinImageUrl(pin.image, pin.aspectRatio, 800);
        };
        if (typeof w.requestIdleCallback === "function") {
          idleHandle = w.requestIdleCallback(fire);
        } else {
          timeoutHandle = window.setTimeout(fire, 250);
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (idleHandle != null) w.cancelIdleCallback?.(idleHandle);
      if (timeoutHandle != null) window.clearTimeout(timeoutHandle);
    };
  }, [pin.image, pin.aspectRatio]);

  return (
    <Link
      ref={linkRef}
      href={`/demo/pinterest/feed/${pin.id}`}
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
