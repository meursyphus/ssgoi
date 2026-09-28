"use client";

import { pinImageDimensions } from "@/demo/pinterest/api/pin/image";
import type { PinSimple } from "@/demo/pinterest/state/pin";

export function PinPreview({ pin }: { pin: PinSimple }) {
  const size = pinImageDimensions(pin.aspectRatio, 400);
  return (
    <div className="mx-4 mt-2 flex items-center gap-3 rounded-2xl bg-neutral-100 p-3">
      <img
        src={pin.image}
        alt=""
        width={size.width}
        height={size.height}
        className="h-20 w-14 shrink-0 rounded-xl object-cover"
      />
      <div className="min-w-0">
        <p className="line-clamp-2 text-[15px] font-semibold leading-snug text-black">
          {pin.title}
        </p>
        <p className="mt-1 truncate text-[13px] text-neutral-500">
          {pin.author.name} · 저장 {pin.saves.toLocaleString("ko-KR")}회
        </p>
      </div>
    </div>
  );
}
