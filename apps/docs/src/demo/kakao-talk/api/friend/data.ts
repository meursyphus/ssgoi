import type { FriendProfile, MeProfile } from "./types";

const me: MeProfile = {
  id: "me",
  name: "Alex Rivera",
  statusMessage: "Working on something new ✨",
  avatar: "https://picsum.photos/seed/kakao-me/200/200",
};

const seed: FriendProfile[] = [
  {
    id: "f-001",
    name: "Mia Chen 🎂",
    statusMessage: "Birthday today!",
    avatar: "https://picsum.photos/seed/kakao-mia/200/200",
    background: "https://picsum.photos/seed/kakao-mia-bg/600/400",
    joinedAt: "2019.04.12",
  },
  {
    id: "f-002",
    name: "Jordan Park ☕️",
    statusMessage: "Coffee fixes everything",
    avatar: "https://picsum.photos/seed/kakao-jordan/200/200",
    background: "https://picsum.photos/seed/kakao-jordan-bg/600/400",
    joinedAt: "2018.11.03",
    music: { title: "Sunflower", artist: "Post Malone" },
  },
  {
    id: "f-003",
    name: "Riley Sato 🌷",
    statusMessage: "Hiking on weekends",
    avatar: "https://picsum.photos/seed/kakao-riley/200/200",
    background: "https://picsum.photos/seed/kakao-riley-bg/600/400",
    joinedAt: "2020.06.21",
  },
  {
    id: "f-004",
    name: "Sam Okafor",
    statusMessage: "Counting down to Friday",
    avatar: "https://picsum.photos/seed/kakao-sam/200/200",
    background: "https://picsum.photos/seed/kakao-sam-bg/600/400",
    joinedAt: "2021.02.18",
  },
  {
    id: "f-005",
    name: "Noa Lindqvist",
    statusMessage: "🐶 Out walking the dog",
    avatar: "https://picsum.photos/seed/kakao-noa/200/200",
    background: "https://picsum.photos/seed/kakao-noa-bg/600/400",
    joinedAt: "2017.09.05",
  },
  {
    id: "f-006",
    name: "Devon Hale",
    statusMessage: "",
    avatar: "https://picsum.photos/seed/kakao-devon/200/200",
    background: "https://picsum.photos/seed/kakao-devon-bg/600/400",
    joinedAt: "2022.01.14",
  },
  {
    id: "f-007",
    name: "Kira Velez",
    statusMessage: "Back to the gym 💪",
    avatar: "https://picsum.photos/seed/kakao-kira/200/200",
    background: "https://picsum.photos/seed/kakao-kira-bg/600/400",
    joinedAt: "2020.10.22",
  },
];

/** id "me"로 들어오면 me 프로필을 FriendProfile 모양으로 돌려준다 */
const meAsFriend: FriendProfile = {
  id: me.id,
  name: me.name,
  statusMessage: me.statusMessage,
  avatar: me.avatar,
  background: "https://picsum.photos/seed/kakao-me-bg/600/400",
  joinedAt: "2016.03.01",
};

export const data = {
  me: () => ({ ...me }),
  all: () => seed.map((f) => ({ ...f })),
  byId: (id: string) => {
    if (id === me.id) return { ...meAsFriend };
    const found = seed.find((f) => f.id === id);
    return found ? { ...found } : null;
  },
  birthdayIds: ["f-001"],
  favoriteIds: ["f-002", "f-003"],
};
