import type { RecommendedCategory } from "./types";

const seed: RecommendedCategory[] = [
  {
    label: "여자 치마",
    badge: "추천 아이디어",
    thumbnails: [
      "/demo/pinterest/12-400x800.jpg",
      "/demo/pinterest/15-400x800.jpg",
      "/demo/pinterest/17-400x667.jpg",
      "/demo/pinterest/14-400x1000.jpg",
    ],
  },
  {
    label: "만년필",
    badge: "추천 아이디어",
    thumbnails: [
      "/demo/pinterest/11-400x667.jpg",
      "/demo/pinterest/20-400x800.jpg",
      "/demo/pinterest/13-400x533.jpg",
      "/demo/pinterest/16-400x600.jpg",
    ],
  },
  {
    label: "Study room decor",
    badge: "추천 아이디어",
    thumbnails: [
      "/demo/pinterest/19-400x667.jpg",
      "/demo/pinterest/21-400x533.jpg",
      "/demo/pinterest/24-400x600.jpg",
      "/demo/pinterest/13-400x533.jpg",
    ],
  },
  {
    label: "겨울코디",
    badge: "추천 아이디어",
    thumbnails: [
      "/demo/pinterest/21-400x533.jpg",
      "/demo/pinterest/23-400x800.jpg",
      "/demo/pinterest/14-400x1000.jpg",
      "/demo/pinterest/12-400x800.jpg",
    ],
  },
];

export const data = {
  all: () => seed.map((c) => ({ ...c, thumbnails: [...c.thumbnails] })),
};
