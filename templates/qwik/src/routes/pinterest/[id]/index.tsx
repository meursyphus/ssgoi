import { component$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { getPinterestItem } from "~/data/pinterest";

const imageHeightFromRatio = (aspectRatio: string) => {
  const [width, height] = aspectRatio.split("/").map(Number);
  return width > 0 && height > 0 ? Math.round((400 * height) / width) : 400;
};

export default component$(() => {
  const location = useLocation();
  const pinId = location.params.id;
  const item = getPinterestItem(pinId);

  if (!item) {
    return (
      <div data-ssgoi-transition={`/pinterest/${pinId}`}>
        <div class="min-h-screen bg-[#121212] px-4 py-8">
          <p class="text-gray-400">Pin not found</p>
        </div>
      </div>
    );
  }

  return (
    <div data-ssgoi-transition={`/pinterest/${item.id}`}>
      <div class="min-h-screen bg-[#121212]">
        <div class="px-4 py-4">
          <Link
            href="/pinterest/"
            class="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-xs"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </Link>
        </div>

        <div class="px-4 pb-6">
          <img
            class="w-full rounded-lg mb-4"
            src={item.image}
            alt={item.title}
            width={400}
            height={imageHeightFromRatio(item.aspectRatio)}
            style={{ aspectRatio: item.aspectRatio }}
            data-zoom-enter-key={item.id}
          />

          <div>
            <h1 class="text-base font-medium text-white mb-3">{item.title}</h1>
            <p class="text-xs text-neutral-300 mb-4 leading-relaxed">
              {item.content}
            </p>

            <div class="flex justify-between items-center mb-3">
              <span class="px-2 py-0.5 bg-white/5 text-neutral-400 rounded text-xs">
                {item.category}
              </span>
              <span class="text-neutral-500 text-xs">
                {item.saves.toLocaleString()} saves
              </span>
            </div>

            <div class="flex flex-wrap gap-1.5 mb-6">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  class="text-xs text-neutral-400 bg-white/5 px-2 py-0.5 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {item.ingredients && (
              <div class="mb-6">
                <h3 class="text-sm font-medium text-white mb-2">Ingredients</h3>
                <ul class="space-y-1">
                  {item.ingredients.map((ingredient) => (
                    <li
                      key={ingredient}
                      class="flex items-start gap-2 text-neutral-300 text-xs"
                    >
                      <span class="text-neutral-500 mt-0.5">&middot;</span>
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {item.materials && (
              <div class="mb-6">
                <h3 class="text-sm font-medium text-white mb-2">Materials</h3>
                <ul class="space-y-1">
                  {item.materials.map((material) => (
                    <li
                      key={material}
                      class="flex items-start gap-2 text-neutral-300 text-xs"
                    >
                      <span class="text-neutral-500 mt-0.5">&middot;</span>
                      <span>{material}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {item.steps && (
              <div class="mb-6">
                <h3 class="text-sm font-medium text-white mb-2">Steps</h3>
                <ol class="space-y-2">
                  {item.steps.map((step, index) => (
                    <li key={step} class="flex gap-2 text-neutral-300 text-xs">
                      <span class="flex-shrink-0 w-5 h-5 bg-white/10 text-white rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div class="flex items-center gap-3 p-3 border border-white/5 rounded-lg">
              <img
                src={item.author.avatar}
                alt={item.author.name}
                width={40}
                height={40}
                class="w-10 h-10 rounded-full"
              />
              <div class="flex-1">
                <div class="text-xs font-medium text-white">
                  {item.author.name}
                </div>
                <div class="text-xs text-neutral-400 mb-0.5">
                  {item.author.bio}
                </div>
                <div class="text-xs text-neutral-500">
                  {item.author.followers.toLocaleString()} followers
                </div>
              </div>
              <button class="px-3 py-1.5 bg-white text-black rounded-full text-xs font-medium hover:bg-neutral-200 transition-colors">
                Follow
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
