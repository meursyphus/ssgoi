import { X } from "lucide-react";
import { DemoBackLink } from "@/lib/components/demo-back-link";
import { routes } from "@/demo/air-bnb/page/shared/routes";

export function SearchHeader() {
  return (
    <div className="relative flex h-16 items-center justify-center px-4">
      <DemoBackLink
        fallback={routes.explore}
        aria-label="Close"
        className="absolute left-4 flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-900 active:scale-95"
      >
        <X className="h-4 w-4" strokeWidth={2.4} />
      </DemoBackLink>
      <div className="flex flex-col items-center">
        <span className="text-[22px] leading-none">🏡</span>
        <span className="pt-1 text-[12px] font-semibold text-neutral-900">
          Homes
        </span>
      </div>
    </div>
  );
}
