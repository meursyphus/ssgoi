import { A } from "@solidjs/router";
import { For, Show, createMemo } from "solid-js";
import {
  getPinterestItem,
  pinterestItems,
  type PinterestItem,
} from "../data/pinterest";

export function PinterestPage() {
  const leftColumnItems = pinterestItems.filter((_, index) => index % 2 === 0);
  const rightColumnItems = pinterestItems.filter((_, index) => index % 2 === 1);

  return (
    <div
      data-ssgoi-transition="/pinterest"
      class="min-h-screen bg-[#121212] px-4 py-6"
    >
      <div class="mb-6">
        <h1 class="text-sm font-medium text-white mb-1">Gallery</h1>
        <p class="text-xs text-neutral-500">
          Explore inspiring ideas and creativity
        </p>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div class="flex flex-col gap-2">
          <For each={leftColumnItems}>{(item) => <PinCard item={item} />}</For>
        </div>
        <div class="flex flex-col gap-2">
          <For each={rightColumnItems}>{(item) => <PinCard item={item} />}</For>
        </div>
      </div>
    </div>
  );
}

export function PinterestDetailPage(props: { pinId: string }) {
  const item = createMemo(() => getPinterestItem(props.pinId));

  return (
    <Show
      when={item()}
      fallback={
        <div
          data-ssgoi-transition={`/pinterest/${props.pinId}`}
          class="min-h-screen bg-[#121212] px-4 py-8"
        >
          <p class="text-gray-400">Pin not found</p>
        </div>
      }
    >
      {(item) => (
        <div
          data-ssgoi-transition={`/pinterest/${item().id}`}
          class="min-h-screen bg-[#121212]"
        >
          <div class="px-4 py-4">
            <A
              href="/pinterest"
              class="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-xs"
              inactiveClass=""
              activeClass=""
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
            </A>
          </div>

          <div class="px-4 pb-6">
            <img
              class="w-full rounded-lg mb-4"
              src={item().image}
              alt={item().title}
              style={{ "aspect-ratio": item().aspectRatio }}
              data-zoom-enter-key={item().id}
            />

            <h1 class="text-base font-medium text-white mb-3">
              {item().title}
            </h1>
            <p class="text-xs text-neutral-300 mb-4 leading-relaxed">
              {item().content}
            </p>

            <div class="flex justify-between items-center mb-3">
              <span class="px-2 py-0.5 bg-white/5 text-neutral-400 rounded text-xs">
                {item().category}
              </span>
              <span class="text-neutral-500 text-xs">
                {item().saves.toLocaleString()} saves
              </span>
            </div>

            <div class="flex flex-wrap gap-1.5 mb-6">
              <For each={item().tags}>
                {(tag) => (
                  <span class="text-xs text-neutral-400 bg-white/5 px-2 py-0.5 rounded">
                    #{tag}
                  </span>
                )}
              </For>
            </div>

            <DetailList title="Ingredients" items={item().ingredients} />
            <DetailList title="Materials" items={item().materials} />
            <DetailSteps items={item().steps} />

            <div class="flex items-center gap-3 p-3 border border-white/5 rounded-lg">
              <img
                src={item().author.avatar}
                alt={item().author.name}
                class="w-10 h-10 rounded-full"
              />
              <div class="flex-1">
                <div class="text-xs font-medium text-white">
                  {item().author.name}
                </div>
                <div class="text-xs text-neutral-400 mb-0.5">
                  {item().author.bio}
                </div>
                <div class="text-xs text-neutral-500">
                  {item().author.followers.toLocaleString()} followers
                </div>
              </div>
              <button class="px-3 py-1.5 bg-white text-black rounded-full text-xs font-medium hover:bg-neutral-200 transition-colors">
                Follow
              </button>
            </div>
          </div>
        </div>
      )}
    </Show>
  );
}

function PinCard(props: { item: PinterestItem }) {
  return (
    <A
      href={`/pinterest/${props.item.id}`}
      class="block border border-white/5 rounded-lg overflow-hidden transition-all duration-200 hover:border-white/10 group"
      inactiveClass=""
      activeClass=""
    >
      <div class="relative" style={{ "aspect-ratio": props.item.aspectRatio }}>
        <img
          src={props.item.image}
          alt={props.item.title}
          class="w-full h-full object-cover bg-[#111]"
          data-zoom-exit-key={props.item.id}
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        <button class="absolute top-2 right-2 bg-white/10 text-white px-2 py-0.5 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white/20">
          Save
        </button>
      </div>

      <div class="p-2.5">
        <h3 class="font-medium text-white text-xs mb-1.5 line-clamp-2">
          {props.item.title}
        </h3>

        <div class="flex items-center gap-1.5 mb-2">
          <img
            src={props.item.author.avatar}
            alt={props.item.author.name}
            class="w-4 h-4 rounded-full"
          />
          <span class="text-xs text-neutral-400">{props.item.author.name}</span>
        </div>

        <div class="flex items-center justify-between text-xs">
          <span class="text-neutral-500">
            {props.item.saves.toLocaleString()} saves
          </span>
          <span class="px-1.5 py-0.5 bg-white/5 text-neutral-400 rounded">
            {props.item.category}
          </span>
        </div>
      </div>
    </A>
  );
}

function DetailList(props: { title: string; items?: string[] }) {
  return (
    <Show when={props.items}>
      {(items) => (
        <div class="mb-6">
          <h3 class="text-sm font-medium text-white mb-2">{props.title}</h3>
          <ul class="space-y-1">
            <For each={items()}>
              {(item) => (
                <li class="flex items-start gap-2 text-neutral-300 text-xs">
                  <span class="text-neutral-500 mt-0.5">-</span>
                  <span>{item}</span>
                </li>
              )}
            </For>
          </ul>
        </div>
      )}
    </Show>
  );
}

function DetailSteps(props: { items?: string[] }) {
  return (
    <Show when={props.items}>
      {(items) => (
        <div class="mb-6">
          <h3 class="text-sm font-medium text-white mb-2">Steps</h3>
          <ol class="space-y-2">
            <For each={items()}>
              {(step, index) => (
                <li class="flex gap-2 text-neutral-300 text-xs">
                  <span class="flex-shrink-0 w-5 h-5 bg-white/10 text-white rounded-full flex items-center justify-center text-xs font-medium">
                    {index() + 1}
                  </span>
                  <span>{step}</span>
                </li>
              )}
            </For>
          </ol>
        </div>
      )}
    </Show>
  );
}
