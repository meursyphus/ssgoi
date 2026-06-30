import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { pinterestItems, type PinterestItem } from "~/data/pinterest";

const leftColumnItems = pinterestItems.filter((_, index) => index % 2 === 0);
const rightColumnItems = pinterestItems.filter((_, index) => index % 2 === 1);
const imageHeightFromRatio = (aspectRatio: string) => {
  const [width, height] = aspectRatio.split("/").map(Number);
  return width > 0 && height > 0 ? Math.round((400 * height) / width) : 400;
};

export default component$(() => {
  return (
    <div data-ssgoi-transition="/pinterest">
      <div class="min-h-screen bg-[#121212] px-4 py-6">
        <div class="mb-6">
          <h1 class="text-sm font-medium text-white mb-1">Gallery</h1>
          <p class="text-xs text-neutral-500">
            Explore inspiring ideas and creativity
          </p>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div class="flex flex-col gap-2">
            {leftColumnItems.map((item) => (
              <PinCard key={item.id} item={item} />
            ))}
          </div>

          <div class="flex flex-col gap-2">
            {rightColumnItems.map((item) => (
              <PinCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export const PinCard = component$<{ item: PinterestItem }>(({ item }) => {
  return (
    <Link
      href={`/pinterest/${item.id}/`}
      class="block border border-white/5 rounded-lg overflow-hidden transition-all duration-200 hover:border-white/10 group"
    >
      <div class="relative" style={{ aspectRatio: item.aspectRatio }}>
        <img
          src={item.image}
          alt={item.title}
          width={400}
          height={imageHeightFromRatio(item.aspectRatio)}
          class="w-full h-full object-cover bg-[#111]"
          data-zoom-exit-key={item.id}
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        <button class="absolute top-2 right-2 bg-white/10 text-white px-2 py-0.5 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white/20">
          Save
        </button>
      </div>

      <div class="p-2.5">
        <h3 class="font-medium text-white text-xs mb-1.5 line-clamp-2">
          {item.title}
        </h3>

        <div class="flex items-center gap-1.5 mb-2">
          <img
            src={item.author.avatar}
            alt={item.author.name}
            width={32}
            height={32}
            class="w-4 h-4 rounded-full"
          />
          <span class="text-xs text-neutral-400">{item.author.name}</span>
        </div>

        <div class="flex items-center justify-between text-xs">
          <span class="text-neutral-500">
            {item.saves.toLocaleString()} saves
          </span>
          <span class="px-1.5 py-0.5 bg-white/5 text-neutral-400 rounded">
            {item.category}
          </span>
        </div>
      </div>
    </Link>
  );
});
