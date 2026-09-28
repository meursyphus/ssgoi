"use client";

import { Link } from "@/lib/link";
import { pickerHref } from "@/demo/google-photos/page/shared/create-tools";

/**
 * Featured banner — the white "Create" pill starts a highlight video, which
 * opens the photo picker as a sheet.
 */
export function HeroCard() {
  return (
    <Link
      href={pickerHref("highlight")}
      scroll={false}
      aria-label="Create a highlight video"
      className="group relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#8E5BE8] via-[#7B5BE8] to-[#5F76F5]"
    >
      <span className="rounded-full bg-white/95 px-5 py-2 text-[14px] font-semibold text-neutral-900 shadow transition-transform group-active:scale-95">
        Create
      </span>
      <span className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
      <span className="absolute -right-4 -bottom-4 h-20 w-20 rounded-full bg-white/15" />
    </Link>
  );
}
