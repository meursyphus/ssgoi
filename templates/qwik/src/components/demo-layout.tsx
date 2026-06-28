import { $, Slot, component$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { Ssgoi } from "@ssgoi/qwik";
import { drill, zoom } from "@ssgoi/qwik/view-transitions";

const ssgoiConfig$ = $(() => ({
  preserveScroll: { exclude: ["/posts/*"] },
  transitions: [
    zoom({
      paths: ["/pinterest", "/pinterest/*"],
      type: "expand" as const,
    }),
    drill({
      enter: "/posts/*",
      exit: "/posts",
    }),
    zoom({
      paths: ["/profile", "/profile/*"],
      type: "static" as const,
    }),
  ],
}));

export const DemoLayout = component$(() => {
  const location = useLocation();
  const pathname = location.url.pathname;

  return (
    <div class="h-full bg-[#121212] flex z-0">
      <div class="w-full bg-[#121212] flex flex-col overflow-hidden relative">
        <main
          id="demo-content"
          class="flex-1 w-full overflow-y-scroll overflow-x-hidden relative z-0 bg-[#121212] scrollbar-hide"
        >
          <Ssgoi config$={ssgoiConfig$}>
            <Slot />
          </Ssgoi>
        </main>

        <nav class="flex justify-around items-center bg-[#121212] border-t border-white/5 py-2 flex-shrink-0">
          <Link
            href="/posts/"
            class={`flex flex-col items-center gap-1 px-4 py-2 text-xs min-w-[64px] transition-colors duration-200 ${
              pathname.startsWith("/posts")
                ? "text-white"
                : "text-neutral-500 hover:text-neutral-400"
            }`}
          >
            <div class="w-5 h-5">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <span>Posts</span>
          </Link>

          <Link
            href="/products/all/"
            class={`flex flex-col items-center gap-1 px-4 py-2 text-xs min-w-[64px] transition-colors duration-200 ${
              pathname.startsWith("/products")
                ? "text-white"
                : "text-neutral-500 hover:text-neutral-400"
            }`}
          >
            <div class="w-5 h-5">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
            <span>Shop</span>
          </Link>

          <Link
            href="/pinterest/"
            class={`flex flex-col items-center gap-1 px-4 py-2 text-xs min-w-[64px] transition-colors duration-200 ${
              pathname.startsWith("/pinterest")
                ? "text-white"
                : "text-neutral-500 hover:text-neutral-400"
            }`}
          >
            <div class="w-5 h-5">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </div>
            <span>Gallery</span>
          </Link>

          <Link
            href="/profile/"
            class={`flex flex-col items-center gap-1 px-4 py-2 text-xs min-w-[64px] transition-colors duration-200 ${
              pathname.startsWith("/profile")
                ? "text-white"
                : "text-neutral-500 hover:text-neutral-400"
            }`}
          >
            <div class="w-5 h-5">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <span>Profile</span>
          </Link>
        </nav>
      </div>
    </div>
  );
});
