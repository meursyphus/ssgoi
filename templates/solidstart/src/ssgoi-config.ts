import type { SsgoiConfig } from "@ssgoi/solid";
import { drill, slide, zoom } from "@ssgoi/solid/view-transitions";

export const PRODUCT_CATEGORIES = [
  { id: "all", label: "All", path: "/products/all" },
  { id: "electronics", label: "Tech", path: "/products/electronics" },
  { id: "fashion", label: "Fashion", path: "/products/fashion" },
  { id: "home", label: "Home", path: "/products/home" },
  { id: "beauty", label: "Beauty", path: "/products/beauty" },
];

export const ssgoiConfig = {
  preserveScroll: { exclude: ["/posts/*"] },
  transitions: [
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
      ordered: PRODUCT_CATEGORIES.map((category) => category.path),
      transition: slide(),
    },
  ],
} satisfies SsgoiConfig;
