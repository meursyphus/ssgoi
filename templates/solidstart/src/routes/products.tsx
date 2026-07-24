import { A, useLocation } from "@solidjs/router";
import { For, type JSX } from "solid-js";
import { PRODUCT_CATEGORIES } from "../ssgoi-config";

export default function ProductsLayout(props: { children?: JSX.Element }) {
  const location = useLocation();

  return (
    <div
      data-ssgoi-transition={location.pathname}
      class="min-h-screen bg-[#121212] flex flex-col"
    >
      <div class="px-4 pt-6 pb-3 flex-shrink-0">
        <h1 class="text-sm font-medium text-white mb-1">Shop</h1>
        <p class="text-xs text-neutral-500">Discover our curated collection</p>
      </div>

      <div class="px-4 mb-4 flex-shrink-0">
        <div class="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          <For each={PRODUCT_CATEGORIES}>
            {(category) => (
              <A
                href={category.path}
                inactiveClass=""
                activeClass=""
                class={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  location.pathname === category.path
                    ? "bg-white text-black"
                    : "bg-white/10 text-neutral-400 hover:bg-white/15"
                }`}
              >
                {category.label}
              </A>
            )}
          </For>
        </div>
      </div>

      <div class="flex-1 overflow-hidden relative">{props.children}</div>
    </div>
  );
}
