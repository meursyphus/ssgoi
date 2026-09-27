import type {
  Follows,
  FollowUser,
  Highlight,
  ProfileMe,
  StoryDetail,
  StoryTrayItem,
} from "./types";

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
};

const frame = (seed: string) => ({
  id: seed,
  image: `https://picsum.photos/seed/${seed}/400/700`,
});

// 친구 계정 — 게시물 댓글/태그됨과 같은 유저네임·아바타 시드
const friend = (username: string, seed: string) => ({
  username,
  avatar: `https://picsum.photos/seed/${seed}/160/160`,
});
const MISO = friend("miso_devv", "comment-miso");
const HARU = friend("haru_oc", "comment-haru");
const KIM = friend("kim__sj", "comment-kim");
const RENA = friend("rena_films", "comment-rena");

const stories: StoryDetail[] = [
  {
    id: me.username,
    label: me.username,
    avatar: me.avatar,
    timeLabel: "3시간",
    isMine: true,
    viewersLabel: "조회 24명",
    frames: [frame("story-me-desk"), frame("story-me-night")],
  },
  // 하이라이트 — 첫 장은 커버와 같은 사진이라 원에서 펼쳐질 때 이어져 보인다
  ...highlights.map((h, i) => ({
    id: `hl-${h.id}`,
    label: h.label,
    avatar: h.cover,
    timeLabel: ["2주", "5주", "8주"][i] ?? "8주",
    isMine: true,
    viewersLabel: null,
    frames: [
      { id: `hl-${h.id}-1`, image: h.cover.replace("/200/200", "/400/700") },
      frame(`${h.id}-highlight-2`),
    ],
  })),
  {
    id: MISO.username,
    label: MISO.username,
    avatar: MISO.avatar,
    timeLabel: "1시간",
    isMine: false,
    viewersLabel: null,
    frames: [frame("story-miso-cafe"), frame("story-miso-latte")],
  },
  {
    id: HARU.username,
    label: HARU.username,
    avatar: HARU.avatar,
    timeLabel: "4시간",
    isMine: false,
    viewersLabel: null,
    frames: [frame("story-haru-river")],
  },
  {
    id: KIM.username,
    label: KIM.username,
    avatar: KIM.avatar,
    timeLabel: "7시간",
    isMine: false,
    viewersLabel: null,
    frames: [frame("story-kim-study"), frame("story-kim-night")],
  },
  {
    id: RENA.username,
    label: RENA.username,
    avatar: RENA.avatar,
    timeLabel: "12시간",
    isMine: false,
    viewersLabel: null,
    frames: [frame("story-rena-film"), frame("story-rena-alley")],
  },
];

const tray: StoryTrayItem[] = [
  {
    id: me.username,
    label: "내 스토리",
    avatar: me.avatar,
    isMine: true,
    seen: false,
  },
  ...[MISO, HARU, KIM, RENA].map((f, i) => ({
    id: f.username,
    label: f.username,
    avatar: f.avatar,
    isMine: false,
    seen: i === 3,
  })),
];

const user = (
  username: string,
  name: string,
  seed: string,
  hasStory: boolean,
  isFollowing: boolean,
): FollowUser => ({
  id: username,
  username,
  name,
  avatar: `https://picsum.photos/seed/${seed}/160/160`,
  hasStory,
  isFollowing,
});

const follows: Follows = {
  followers: [
    user("miso_devv", "김미소", "comment-miso", true, true),
    user("haru_oc", "오하루", "comment-haru", true, true),
    user("kim__sj", "김서준", "comment-kim", true, true),
    user("alex.chen", "Alex Chen", "comment-alex", false, false),
    user("yoon_dt", "윤다태", "comment-yoon", false, true),
    user("jihye.k", "권지혜", "comment-jihye", false, false),
    user("neo_park", "박네오", "comment-neo", false, true),
    user("rena_films", "레나", "comment-rena", true, true),
    user("ssoo_o", "이수오", "comment-ssoo", false, false),
    user("studio.daily", "스튜디오 데일리", "comment-studio", false, false),
  ],
  following: [
    user("miso_devv", "김미소", "comment-miso", true, true),
    user("haru_oc", "오하루", "comment-haru", true, true),
    user("kim__sj", "김서준", "comment-kim", true, true),
    user("rena_films", "레나", "comment-rena", true, true),
    user("moon_taeyong", "문태용", "comment-moon", false, true),
    user("yoon_dt", "윤다태", "comment-yoon", false, true),
    user("neo_park", "박네오", "comment-neo", false, true),
    user("byungjun_", "최병준", "comment-bj", false, true),
    user("sveltejs", "Svelte", "follow-svelte", false, true),
    user("vercel", "Vercel", "follow-vercel", false, true),
  ],
};

export const data = {
  getMe: () => ({ ...me, highlights: me.highlights.map((h) => ({ ...h })) }),
  storyById: (id: string) => {
    const found = stories.find((s) => s.id === id);
    return found
      ? { ...found, frames: found.frames.map((f) => ({ ...f })) }
      : null;
  },
  storyTray: () => tray.map((t) => ({ ...t })),
  follows: (): Follows => ({
    followers: follows.followers.map((u) => ({ ...u })),
    following: follows.following.map((u) => ({ ...u })),
  }),
};
