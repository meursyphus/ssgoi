import type { Highlight, ProfileMe } from "./types";

const highlights: Highlight[] = [
  {
    id: "blog",
    label: "블로그 만들자",
    cover: "https://picsum.photos/seed/highlight-blog/200/200",
  },
  {
    id: "hi-1",
    label: "하이라이트",
    cover: "https://picsum.photos/seed/highlight-suit/200/200",
  },
  {
    id: "hi-2",
    label: "하이라이트",
    cover: "https://picsum.photos/seed/highlight-vape/200/200",
  },
];

const me: ProfileMe = {
  username: "deaseungseung94",
  name: "문대승",
  bio: "프론트를 좋아하는\n풀스택 개발자 입니다.",
  avatar: "https://picsum.photos/seed/dsmoon-avatar/200/200",
  isPrivate: true,
  hasUnseenStory: true,
  postsCount: 111,
  followersCount: 113,
  followingCount: 277,
  postsLabel: "111",
  followersLabel: "113",
  followingLabel: "277",
  highlights,
  speechBubble: "첫 메모를 작성\n해보세요...",
};

export const data = {
  getMe: () => ({ ...me, highlights: me.highlights.map((h) => ({ ...h })) }),
};
