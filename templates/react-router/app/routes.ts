import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("posts", "routes/posts.tsx"),
  route("posts/:postId", "routes/posts.$postId.tsx"),
  route("products", "routes/products.tsx"),
  layout("routes/products_.layout.tsx", [
    route("products/all", "routes/products_.all.tsx"),
    route("products/electronics", "routes/products_.electronics.tsx"),
    route("products/fashion", "routes/products_.fashion.tsx"),
    route("products/home", "routes/products_.home.tsx"),
    route("products/beauty", "routes/products_.beauty.tsx"),
  ]),
  route("pinterest", "routes/pinterest.tsx"),
  route("pinterest/:pinId", "routes/pinterest.$pinId.tsx"),
  route("profile", "routes/profile.tsx"),
  route("profile/:postId", "routes/profile.$postId.tsx"),
] satisfies RouteConfig;
