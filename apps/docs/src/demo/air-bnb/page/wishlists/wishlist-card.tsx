import { Heart } from "lucide-react";
import { Link } from "@/lib/link";
import type { WishlistSummary } from "@/demo/air-bnb/state/wishlist";
import { routes } from "@/demo/air-bnb/page/shared/routes";

export function WishlistCard({ summary }: { summary: WishlistSummary }) {
  return (
    <Link
      href={routes.collection(summary.key)}
      scroll={false}
      className="flex flex-col gap-2 active:opacity-80"
    >
      <Collage covers={summary.covers} />
      <div className="px-0.5">
        <p className="truncate text-[15px] font-semibold text-neutral-900">
          {summary.title}
        </p>
        <p className="text-[13px] text-neutral-500">{summary.caption}</p>
      </div>
    </Link>
  );
}

/** Airbnb's 2x2 cover: one photo fills it, more split into quarters. */
function Collage({ covers }: { covers: string[] }) {
  if (covers.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-neutral-100">
        <Heart className="h-8 w-8 text-neutral-300" strokeWidth={1.8} />
      </div>
    );
  }
  if (covers.length === 1) {
    return (
      <div className="aspect-square overflow-hidden rounded-2xl bg-neutral-100">
        <img
          src={covers[0]}
          alt=""
          width={900}
          height={900}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }
  // 2 → halves, 3 → one tall + two stacked, 4 → quarters.
  const tall = covers.length === 3;
  return (
    <div
      className={`grid aspect-square grid-cols-2 gap-0.5 overflow-hidden rounded-2xl bg-neutral-100 ${
        covers.length === 2 ? "grid-rows-1" : "grid-rows-2"
      }`}
    >
      {covers.map((src, idx) => (
        <img
          key={src}
          src={src}
          alt=""
          width={900}
          height={900}
          className={`h-full w-full object-cover ${tall && idx === 0 ? "row-span-2" : ""}`}
        />
      ))}
    </div>
  );
}
