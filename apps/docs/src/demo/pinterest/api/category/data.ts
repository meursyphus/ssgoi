import type { RecommendedCategory } from "./types";

const thumb = (seed: string) =>
  `https://picsum.photos/seed/${seed}/200/267`;

const seed: RecommendedCategory[] = [
  {
    label: "여자 치마",
    badge: "추천 아이디어",
    thumbnails: [
      thumb("pinterest-pin-3"),
      thumb("pinterest-pin-6"),
      thumb("pinterest-pin-8"),
      thumb("pinterest-pin-5"),
    ],
  },
  {
    label: "만년필",
    badge: "추천 아이디어",
    thumbnails: [
      thumb("pinterest-pin-2"),
      thumb("pinterest-pin-11"),
      thumb("pinterest-pin-4"),
      thumb("pinterest-pin-7"),
    ],
  },
  {
    label: "Study room decor",
    badge: "추천 아이디어",
    thumbnails: [
      thumb("pinterest-pin-10"),
      thumb("pinterest-pin-12"),
      thumb("pinterest-pin-15"),
      thumb("pinterest-pin-4"),
    ],
  },
  {
    label: "겨울코디",
    badge: "추천 아이디어",
    thumbnails: [
      thumb("pinterest-pin-12"),
      thumb("pinterest-pin-14"),
      thumb("pinterest-pin-5"),
      thumb("pinterest-pin-3"),
    ],
  },
];

export const data = {
  all: () => seed.map((c) => ({ ...c, thumbnails: [...c.thumbnails] })),
};
