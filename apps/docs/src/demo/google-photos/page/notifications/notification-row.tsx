"use client";

import { Link } from "@/lib/link";
import type { NotificationItem } from "@/demo/google-photos/api/notification";
import { BASE } from "@/demo/google-photos/page/shared/paths";

/**
 * One activity row. Photo rows key their thumbnail for the hero into the
 * viewer; collection rows drill into the album.
 */
export function NotificationRow({ item }: { item: NotificationItem }) {
  const { target } = item;
  const href =
    target.type === "photo"
      ? `${BASE}/p/${target.photoId}`
      : `${BASE}/c/${target.collectionId}`;

  return (
    <Link
      href={href}
      scroll={false}
      className={`flex items-center gap-4 px-4 py-3 active:bg-neutral-100 ${
        item.unread ? "bg-[#F4F8FE]" : "bg-white"
      }`}
    >
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
        <img
          src={item.thumbSrc}
          alt=""
          width={item.width}
          height={item.height}
          className="h-full w-full object-cover"
          data-hero-exit-key={
            target.type === "photo" ? target.photoId : undefined
          }
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-medium text-neutral-900">
          {item.title}
        </p>
        <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-neutral-600">
          {item.body}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2 self-start pt-1">
        <span className="text-[12px] text-neutral-500">{item.time}</span>
        {item.unread && (
          <span
            aria-label="Unread"
            className="h-2 w-2 rounded-full bg-[#1A73E8]"
          />
        )}
      </div>
    </Link>
  );
}
