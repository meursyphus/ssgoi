"use client";

import { Link } from "@/lib/link";
import { useEffect, useRef } from "react";
import type { PhotoSimple } from "@/demo/google-photos/state/photo";

export function PhotoGridLink({ photo }: { photo: PhotoSimple }) {
  const linkRef = useRef<HTMLAnchorElement>(null);

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
          img.src = photo.src;
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
  }, [photo.src]);

  return (
    <Link
      ref={linkRef}
      href={`/demo/google-photos/p/${photo.id}`}
      scroll={false}
      className="relative block aspect-square bg-neutral-100"
    >
      <img
        src={photo.thumbSrc}
        alt={photo.takenAt}
        width={photo.width}
        height={photo.height}
        className="h-full w-full object-cover"
        data-hero-exit-key={photo.id}
      />
    </Link>
  );
}
