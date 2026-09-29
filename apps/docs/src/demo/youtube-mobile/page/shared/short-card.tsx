import { Link } from "@/lib/link";
import { BASE, type MockShort } from "../../mock-data";
import { MoreButton } from "./action-sheet";

/**
 * Portrait Shorts card. The card opens the full-screen player (the <img>
 * carries a `short-` namespaced zoom exit key); ⋮ is a sibling button.
 */
export function ShortCard({
  short,
  className = "",
}: {
  short: MockShort;
  className?: string;
}) {
  return (
    <article
      className={`relative overflow-hidden rounded-xl bg-neutral-900 ${className}`}
    >
      <Link
        href={`${BASE}/shorts/${short.id}`}
        scroll={false}
        className="block h-full w-full"
      >
        <img
          src={short.image}
          alt=""
          width={600}
          height={920}
          data-zoom-exit-key={`short-${short.id}`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent px-3 pb-3 pt-14 text-white">
          <h2 className="line-clamp-2 text-[14px] font-semibold leading-[18px]">
            {short.title}
          </h2>
          <p className="mt-1 text-[11px] text-white/80">{short.views}</p>
        </div>
      </Link>
      <MoreButton
        menu="short"
        className="absolute right-1 top-1 h-8 w-8 text-white drop-shadow active:bg-white/20"
      />
    </article>
  );
}
