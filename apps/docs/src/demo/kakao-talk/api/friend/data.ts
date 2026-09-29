import type { FriendProfile, FriendSimple, MeProfile } from "./types";

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

/** 추천친구 — 아직 친구가 아니라 친구 목록/검색/소식에는 나오지 않는다 */
const recommendedSeed: FriendProfile[] = [
  {
    id: "f-008",
    name: "Theo Brandt",
    statusMessage: "Film photography on Sundays 📷",
    avatar: "https://picsum.photos/seed/kakao-theo/200/200",
    background: "https://picsum.photos/seed/kakao-theo-bg/600/400",
    joinedAt: "2021.08.30",
  },
  {
    id: "f-009",
    name: "Ivy Nakamura",
    statusMessage: "New in Seoul 👋",
    avatar: "https://picsum.photos/seed/kakao-ivy/200/200",
    background: "https://picsum.photos/seed/kakao-ivy-bg/600/400",
    joinedAt: "2023.03.11",
  },
  {
    id: "f-010",
    name: "Marco Ruiz",
    statusMessage: "Always down for tacos 🌮",
    avatar: "https://picsum.photos/seed/kakao-marco/200/200",
    background: "https://picsum.photos/seed/kakao-marco-bg/600/400",
    joinedAt: "2019.12.02",
  },
];

const kakaoIds: Record<string, string> = {
  "f-008": "theo.b",
  "f-009": "ivy_nkmr",
  "f-010": "marco.ruiz",
};

/** 프로필 업데이트 — 최신순. label은 소식 카드에 표시 */
const profileUpdates: { id: string; label: string }[] = [
  { id: "f-003", label: "오늘" },
  { id: "f-002", label: "오늘" },
  { id: "f-007", label: "어제" },
  { id: "f-005", label: "5월 16일" },
  { id: "f-006", label: "5월 14일" },
  { id: "f-004", label: "5월 10일" },
  { id: "f-001", label: "4월 30일" },
];

/** 소식 탭에 보이는 최근 업데이트 (최근 일주일) */
const NEWS_COUNT = 5;

const upcomingBirthdays: { id: string; dateLabel: string }[] = [
  { id: "f-006", dateLabel: "5월 21일 (목)" },
  { id: "f-005", dateLabel: "5월 26일 (화)" },
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

export function toSimple(profile: FriendProfile): FriendSimple {
  const { background, joinedAt, ...rest } = profile;
  void background;
  void joinedAt;
  return rest;
}

const byName = (a: FriendProfile, b: FriendProfile) =>
  a.name.localeCompare(b.name, "en");

const updateRank = (id: string) => {
  const i = profileUpdates.findIndex((u) => u.id === id);
  return i < 0 ? profileUpdates.length : i;
};

const matches = (f: FriendProfile, needle: string, extra = "") =>
  f.name.toLowerCase().includes(needle) ||
  f.statusMessage.toLowerCase().includes(needle) ||
  extra.toLowerCase().includes(needle);

export const data = {
  me: () => ({ ...me }),
  all: () => seed.map((f) => ({ ...f })),
  byId: (id: string) => {
    if (id === me.id) return { ...meAsFriend };
    const found = [...seed, ...recommendedSeed].find((f) => f.id === id);
    return found ? { ...found } : null;
  },
  birthdayIds: ["f-001"],
  favoriteIds: ["f-002", "f-003"],
  sortedByName: (list: FriendProfile[]) => [...list].sort(byName),
  sortedByUpdate: (list: FriendProfile[]) =>
    [...list].sort((a, b) => updateRank(a.id) - updateRank(b.id)),
  search: (q: string) => {
    const needle = q.trim().toLowerCase();
    return seed.filter((f) => matches(f, needle)).map((f) => ({ ...f }));
  },
  recommended: (q: string) => {
    const needle = q.trim().toLowerCase();
    return recommendedSeed
      .filter((f) => !needle || matches(f, needle, kakaoIds[f.id]))
      .map((f) => ({ ...f }));
  },
  news: () =>
    profileUpdates.slice(0, NEWS_COUNT).flatMap(({ id, label }) => {
      const f = seed.find((x) => x.id === id);
      return f ? [{ profile: { ...f }, label }] : [];
    }),
  upcomingBirthdays: () =>
    upcomingBirthdays.flatMap(({ id, dateLabel }) => {
      const f = seed.find((x) => x.id === id);
      return f ? [{ profile: { ...f }, dateLabel }] : [];
    }),
};
