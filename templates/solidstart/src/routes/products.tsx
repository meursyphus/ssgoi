import { A, useLocation } from "@solidjs/router";
import { For, type JSX } from "solid-js";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/solid";
import { slide } from "@ssgoi/solid/view-transitions";

const categories = [
  { id: "all", label: "All", path: "/products/all" },
  { id: "electronics", label: "Tech", path: "/products/electronics" },
  { id: "fashion", label: "Fashion", path: "/products/fashion" },
  { id: "home", label: "Home", path: "/products/home" },
  { id: "beauty", label: "Beauty", path: "/products/beauty" },
];

const productConfig = {
  transitions: [slide({ paths: categories.map((category) => category.path) })],
} satisfies SsgoiConfig;

export default function ProductsLayout(props: { children?: JSX.Element }) {
  const location = useLocation();

  return (
    <div
      data-ssgoi-transition="/products"
      class="min-h-screen bg-[#121212] flex flex-col"
    >
      <div class="px-4 pt-6 pb-3 flex-shrink-0">
        <h1 class="text-sm font-medium text-white mb-1">Shop</h1>
        <p class="text-xs text-neutral-500">Discover our curated collection</p>
      </div>

      <div class="px-4 mb-4 flex-shrink-0">
        <div class="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          <For each={categories}>
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

      <div class="flex-1 overflow-hidden relative">
        <Ssgoi config={productConfig}>{props.children}</Ssgoi>
      </div>
    </div>
  );
}
