import { Link } from "@/lib/link";
import type { ListingDetail } from "@/demo/air-bnb/state/listing";
import { routes } from "@/demo/air-bnb/page/shared/routes";

export function DetailHero({ detail }: { detail: ListingDetail }) {
  return (
    <Link
      href={routes.photos(detail.id)}
      scroll={false}
      aria-label="Show all photos"
      className="relative block aspect-square w-full overflow-hidden bg-neutral-100"
    >
      {/* Zoom target from the list, and the hero source for the photo tour. */}
      <img
        src={detail.images[0]}
        alt={detail.title}
        width={1200}
        height={1200}
        className="h-full w-full object-cover"
        data-zoom-enter-key={detail.id}
        data-hero-exit-key={detail.id}
      />
      <span className="absolute bottom-9 right-4 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium tabular-nums text-white">
        1 / {detail.images.length}
      </span>
    </Link>
  );
}
