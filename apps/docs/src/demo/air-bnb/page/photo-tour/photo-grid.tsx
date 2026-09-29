import type { ListingDetail } from "@/demo/air-bnb/state/listing";

/** First photo full width (the hero lands here), the rest two-up. */
export function PhotoGrid({ detail }: { detail: ListingDetail }) {
  const rest = detail.images.length - 1;
  return (
    <div className="grid grid-cols-2 gap-2 px-4 pb-10">
      {detail.images.map((src, idx) => {
        const wide =
          idx === 0 || (rest % 2 === 1 && idx === detail.images.length - 1);
        return (
          <div
            key={src}
            className={`overflow-hidden rounded-lg bg-neutral-100 ${
              wide ? "col-span-2 aspect-[4/3]" : "aspect-square"
            }`}
          >
            <img
              src={src}
              alt={`${detail.title} — photo ${idx + 1}`}
              width={1200}
              height={idx === 0 ? 1200 : 800}
              loading={idx < 3 ? "eager" : "lazy"}
              className="h-full w-full object-cover"
              data-hero-enter-key={idx === 0 ? detail.id : undefined}
            />
          </div>
        );
      })}
    </div>
  );
}
