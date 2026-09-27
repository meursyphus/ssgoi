"use client";

import { Link } from "@/lib/link";
import { pinImageDimensions } from "@/demo/pinterest/api/pin/image";
import type { InboxUpdate } from "@/demo/pinterest/state/pin";
import { PinterestGlyph } from "../shared/pinterest-glyph";

export function UpdateList({ updates }: { updates: InboxUpdate[] }) {
  return (
    <section aria-label="업데이트" className="pb-6">
      <h2 className="px-4 pt-3 pb-1 text-[16px] font-bold text-black">
        업데이트
      </h2>
      <ul>
        {updates.map((update) => (
          <li key={update.id}>
            <UpdateRow update={update} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function UpdateRow({ update }: { update: InboxUpdate }) {
  const size = pinImageDimensions(update.pin.aspectRatio, 400);
  return (
    <Link
      href={`/demo/pinterest/feed/${update.pin.id}`}
      scroll={false}
      className="flex items-center gap-3 px-4 py-3 active:bg-neutral-50"
    >
      {update.actor ? (
        <img
          src={update.actor.avatar}
          alt=""
          width={96}
          height={96}
          className="h-12 w-12 shrink-0 rounded-full bg-neutral-200 object-cover"
        />
      ) : (
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#E60023] text-white">
          <PinterestGlyph size={26} />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="line-clamp-3 break-keep text-[15px] leading-snug text-black">
          {update.actor && (
            <span className="font-semibold">{update.actor.name}</span>
          )}
          {update.message}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-[13px] text-neutral-500">
          {update.time}
          {update.isNew && (
            <span
              aria-label="새 소식"
              className="h-1.5 w-1.5 rounded-full bg-[#E60023]"
            />
          )}
        </p>
      </div>
      {/* The thumbnail grows into the pin close-up (zoom). */}
      <div className="h-16 w-12 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
        <img
          src={update.pin.image}
          alt={update.pin.title}
          width={size.width}
          height={size.height}
          data-zoom-exit-key={update.pin.id}
          className="h-full w-full object-cover"
        />
      </div>
    </Link>
  );
}
