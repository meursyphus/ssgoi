"use client";

import { toast } from "sonner";
import { ChevronLeft, Camera } from "lucide-react";
import { DemoBackLink } from "@/lib/components/demo-back-link";

export function ReelTopBar({ fallbackHref }: { fallbackHref: string }) {
  return (
    <div className="absolute inset-x-0 top-0 flex items-center justify-between px-2 pt-3">
      <div className="flex items-center gap-1">
        <DemoBackLink
          fallback={fallbackHref}
          aria-label="뒤로"
          className="grid h-10 w-10 place-items-center"
        >
          <ChevronLeft className="h-7 w-7" strokeWidth={2} />
        </DemoBackLink>
        <span className="text-[20px] font-bold tracking-tight">릴스</span>
      </div>
      <button
        type="button"
        aria-label="카메라"
        onClick={() =>
          toast("릴스 촬영은 데모에서 지원하지 않아요", { duration: 1500 })
        }
        className="grid h-10 w-10 place-items-center"
      >
        <Camera className="h-6 w-6" strokeWidth={1.8} />
      </button>
    </div>
  );
}
