import type { ListingDetail } from "@/demo/air-bnb/state/listing";

export function DetailHero({ detail }: { detail: ListingDetail }) {
  return (
    <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
      <img
        src={detail.images[0]}
        alt={detail.title}
        className="h-full w-full object-cover"
        data-zoom-enter-key={detail.id}
      />
      <span className="absolute bottom-9 right-4 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium tabular-nums text-white">
        1 / {Math.max(detail.images.length, 109)}
      </span>
    </div>
  );
}
