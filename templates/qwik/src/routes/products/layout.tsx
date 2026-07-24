import { Slot, component$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { PRODUCT_CATEGORIES } from "../../lib/ssgoi-config";

export default component$(() => {
  const location = useLocation();
  const pathname = location.url.pathname.replace(/\/$/, "");

  return (
    <div
      data-ssgoi-transition={pathname}
      class="min-h-screen bg-[#121212] flex flex-col"
    >
      <div class="px-4 pt-6 pb-3 flex-shrink-0">
        <h1 class="text-sm font-medium text-white mb-1">Shop</h1>
        <p class="text-xs text-neutral-500">Discover our curated collection</p>
      </div>

      <div class="px-4 mb-4 flex-shrink-0">
        <div class="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {PRODUCT_CATEGORIES.map((category) => (
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

      <div class="flex-1 overflow-hidden relative">
        <Slot />
      </div>
    </div>
  );
});
