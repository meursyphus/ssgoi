import { $, Slot, component$, useSignal } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { useSsgoi } from "@ssgoi/qwik";
import { slide } from "@ssgoi/qwik/view-transitions";

const categories = [
  { id: "all", label: "All", path: "/products/all" },
  { id: "electronics", label: "Tech", path: "/products/electronics" },
  { id: "fashion", label: "Fashion", path: "/products/fashion" },
  { id: "home", label: "Home", path: "/products/home" },
  { id: "beauty", label: "Beauty", path: "/products/beauty" },
];

const productConfig$ = $(() => ({
  transitions: [slide({ paths: categories.map((category) => category.path) })],
}));

export default component$(() => {
  const location = useLocation();
  const pathname = location.url.pathname.replace(/\/$/, "");
  const ssgoiRoot = useSignal<HTMLElement>();

  useSsgoi(ssgoiRoot, { config$: productConfig$ });

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
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`${category.path}/`}
              class={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                pathname === category.path
                  ? "bg-white text-black"
                  : "bg-white/10 text-neutral-400 hover:bg-white/15"
              }`}
            >
              {category.label}
            </Link>
          ))}
        </div>
      </div>

      <div
        ref={ssgoiRoot}
        data-ssgoi-root=""
        class="flex-1 overflow-hidden relative"
      >
        <Slot />
      </div>
    </div>
  );
});
