"use client";

import { X } from "lucide-react";
import { DemoBackLink } from "@/lib/components/demo-back-link";
import { routes } from "@/demo/gamja-market/page/shared/routes";

export function ViewerHeader({
  productId,
  count,
}: {
  productId: string;
  count: number;
}) {
  return (
    <header className="absolute inset-x-0 top-0 z-10 flex h-14 items-center justify-between px-2">
      <DemoBackLink
        fallback={routes.product(productId)}
        aria-label="닫기"
        className="flex h-10 w-10 items-center justify-center rounded-full text-white active:bg-white/10"
      >
        <X className="h-6 w-6" />
      </DemoBackLink>
      <span className="text-[14px] font-semibold tabular-nums text-white/90">
        1 / {count}
      </span>
      <div className="w-10" />
    </header>
  );
}
