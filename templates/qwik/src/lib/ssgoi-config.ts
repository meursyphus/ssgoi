import { $ } from "@builder.io/qwik";
import { drill, slide, zoom } from "@ssgoi/qwik/view-transitions";

export const PRODUCT_CATEGORIES = [
  { id: "all", label: "All", path: "/products/all" },
  { id: "electronics", label: "Tech", path: "/products/electronics" },
  { id: "fashion", label: "Fashion", path: "/products/fashion" },
  { id: "home", label: "Home", path: "/products/home" },
  { id: "beauty", label: "Beauty", path: "/products/beauty" },
];

export const ssgoiConfig$ = $(() => ({
  transitions: [
    {
      from: "/pinterest",
      to: "/pinterest/*",
      transition: zoom({ type: "expand" as const }),
    },
    { on: "/posts/**", except: "/posts", transition: drill() },
    {
      from: "/profile",
      to: "/profile/*",
      transition: zoom({ type: "static" as const }),
    },
    {
      ordered: [
        "/products/all",
        "/products/electronics",
        "/products/fashion",
        "/products/home",
        "/products/beauty",
      ],
      transition: slide(),
    },
  ],
}));
