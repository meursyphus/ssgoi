"use client";

import { ChevronLeft, Share2 } from "lucide-react";
import { DemoBackLink } from "@/lib/components/demo-back-link";
import { useProduct } from "@/demo/gamja-market/state/product";
import { BASE } from "@/demo/gamja-market/page/shared/routes";

export function DetailHeader() {
  const product = useProduct((state) => ({ actions: state.actions }));
  return (
    <header className="sticky top-0 z-10 flex h-12 items-center justify-between bg-[#FAF8F6]/95 px-2 backdrop-blur">
      <DemoBackLink
        fallback={BASE}
        aria-label="뒤로"
        className="flex h-9 w-9 items-center justify-center rounded-full text-gray-700 hover:bg-black/5"
      >
        <ChevronLeft className="h-5 w-5" />
      </DemoBackLink>
      <button
        type="button"
        onClick={() => product.actions.share()}
        aria-label="공유"
        className="flex h-9 w-9 items-center justify-center rounded-full text-gray-700 transition-transform hover:bg-black/5 active:scale-90"
      >
        <Share2 className="h-[18px] w-[18px]" />
      </button>
    </header>
  );
}
