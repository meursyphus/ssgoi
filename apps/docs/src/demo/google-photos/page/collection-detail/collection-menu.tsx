"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { MoreVertical, Play, Share2 } from "lucide-react";
import { BASE } from "@/demo/google-photos/page/shared/paths";
import { notify } from "@/demo/google-photos/page/shared/notify";

/**
 * Album overflow menu — only actions that do something: Slideshow opens the
 * first photo (hero from its grid cell), Share copies a link.
 */
export function CollectionMenu({ firstPhotoId }: { firstPhotoId?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  const items = [
    ...(firstPhotoId
      ? [
          {
            Icon: Play,
            label: "Slideshow",
            run: () =>
              router.push(`${BASE}/p/${firstPhotoId}`, { scroll: false }),
          },
        ]
      : []),
    {
      Icon: Share2,
      label: "Share",
      run: () => notify("Link copied"),
    },
  ];

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label="More"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 active:bg-black/[0.05]"
      >
        <MoreVertical className="h-5 w-5" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            style={{ transformOrigin: "top right" }}
            className="absolute right-1 top-11 z-20 min-w-[168px] overflow-hidden rounded-xl bg-white py-1.5 shadow-[0_6px_24px_rgba(0,0,0,0.18)] ring-1 ring-black/5"
          >
            {items.map(({ Icon, label, run }) => (
              <button
                key={label}
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  run();
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-[14px] text-neutral-800 active:bg-neutral-100"
              >
                <Icon className="h-4 w-4 text-neutral-600" />
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
