"use client";

import { Sparkles, Search } from "lucide-react";
import {
  pinImageDimensions,
  pinImageUrl,
} from "@/demo/pinterest/api/pin/image";
import type { PinDetail } from "@/demo/pinterest/state/pin";

export function HeroImage({ pin }: { pin: PinDetail }) {
  const imageSize = pinImageDimensions(pin.aspectRatio, 800);
  return (
    <div className="relative w-full overflow-hidden bg-neutral-100">
      <img
        src={pinImageUrl(pin.image, pin.aspectRatio, 800)}
        alt={pin.title}
        width={imageSize.width}
        height={imageSize.height}
        className="w-full object-cover"
        style={{ aspectRatio: pin.aspectRatio }}
        data-zoom-enter-key={pin.id}
      />

      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
        <Sparkles className="h-3.5 w-3.5" strokeWidth={2.2} />
        <span>AI 수정</span>
      </div>

      <button
        type="button"
        aria-label="검색"
        className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white text-black shadow-[0_2px_8px_rgba(0,0,0,0.18)]"
      >
        <Search className="h-4 w-4" strokeWidth={2.6} />
      </button>
    </div>
  );
}
