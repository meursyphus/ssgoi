import type { SsgoiConfig } from "@ssgoi/vue";
import { drill, fade, slide, zoom } from "@ssgoi/vue/view-transitions";

export const SHOP_CATEGORIES = [
  { id: "all", label: "All", path: "/shop" },
  { id: "electronics", label: "Tech", path: "/shop/electronics" },
  { id: "fashion", label: "Fashion", path: "/shop/fashion" },
  { id: "home", label: "Home", path: "/shop/home" },
  { id: "beauty", label: "Beauty", path: "/shop/beauty" },
];

// Pages under the bottom nav. `/shop/**` (not `/shop/*`) keeps every
// category in one scope: a `*` segment would make each category its own
// instance.
const TOP_LEVEL = ["/posts", "/shop/**", "/pinterest", "/profile"];

export const ssgoiConfig = {
  // Mirrors layouts/top-level.vue and layouts/detail.vue, plus the shop
  // page (pages/(top-level)/shop.vue) nested inside top-level.
  layouts: [
    { paths: TOP_LEVEL, layouts: [{ paths: "/shop/**" }] },
    { paths: "/**", except: TOP_LEVEL },
  ],
  transitions: [
    { from: TOP_LEVEL, to: TOP_LEVEL, transition: fade() },
    {
      from: "/pinterest",
      to: "/pinterest/*",
      transition: zoom({ type: "expand" }),
    },
    { on: "/posts/**", except: "/posts", transition: drill() },
    {
      from: "/profile",
      to: "/profile/*",
      transition: zoom({ type: "static" }),
    },
    {
      ordered: SHOP_CATEGORIES.map((category) => category.path),
      transition: slide(),
    },
  ],
} satisfies SsgoiConfig;
