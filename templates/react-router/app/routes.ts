import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("routes/top-level.layout.tsx", [
    route("posts", "routes/posts.tsx"),
    layout("routes/shop.layout.tsx", [
      route("shop", "routes/shop.tsx"),
      route("shop/electronics", "routes/shop.electronics.tsx"),
      route("shop/fashion", "routes/shop.fashion.tsx"),
      route("shop/home", "routes/shop.home.tsx"),
      route("shop/beauty", "routes/shop.beauty.tsx"),
    ]),
    route("pinterest", "routes/pinterest.tsx"),
    route("profile", "routes/profile.tsx"),
  ]),
  layout("routes/detail.layout.tsx", [
    route("posts/:postId", "routes/posts.$postId.tsx"),
    route("pinterest/:pinId", "routes/pinterest.$pinId.tsx"),
    route("profile/:postId", "routes/profile.$postId.tsx"),
  ]),
] satisfies RouteConfig;
