import { SsgoiPageBoundary } from "@ssgoi/react";
import { CardLink } from "../../card-link";
import { ITEM_COUNT, itemImage } from "../../media";

export default function ListPage() {
  return (
    <SsgoiPageBoundary className="bg-neutral-950">
      <header className="sticky top-0 z-10 bg-neutral-950/90 px-4 py-3 font-semibold backdrop-blur">
        Comwit-like list
      </header>
      <ul className="grid grid-cols-2 gap-3 p-4 md:grid-cols-4">
        {Array.from({ length: ITEM_COUNT }, (_, i) => i + 1).map((id) => (
          <li key={id}>
            <CardLink
              href={`/comwit-like/item/${id}`}
              data-card={id}
              className="flex flex-col gap-2"
            >
              <div
                data-hero-exit-key={`card-${id}`}
                data-zoom-exit-key={`card-${id}`}
                className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-800"
              >
                <img
                  src={itemImage(id)}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <span className="text-xs text-neutral-400">Item {id}</span>
            </CardLink>
          </li>
        ))}
      </ul>
    </SsgoiPageBoundary>
  );
}
