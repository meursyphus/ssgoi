import type {
  ChatDrawer,
  ChatMember,
  ChatMessage,
  ChatPhoto,
  ChatThreadDetail,
  ChatThreadSimple,
  ThreadFilter,
} from "./types";

const threads: ChatThreadDetail[] = [
  {
    id: "c-001",
    friendId: "f-004",
    partnerName: "Launch Crew",
    partnerAvatar: "https://picsum.photos/seed/kakao-group-1/200/200",
    memberCount: 4,
    lastMessage: "why is everyone gatekeeping the new build",
    lastMessageAt: "10:15 AM",
    unreadCount: 2,
    messages: [
      {
        id: "m-001-01",
        senderId: "f-004",
        text: "quick roll call before we lock the launch checklist",
        sentAt: "9:02 AM",
        dateDividerLabel: "Thursday, May 14, 2026",
      },
      {
        id: "m-001-02",
        senderId: "me",
        text: "here — finishing the onboarding pass now",
        sentAt: "9:04 AM",
      },
      {
        id: "m-001-03",
        senderId: "f-006",
        text: "push notifications are finally behaving on the test build",
        sentAt: "9:07 AM",
      },
      {
        id: "m-001-04",
        senderId: "f-001",
        text: "nice, I'll check the empty states after standup",
        sentAt: "9:08 AM",
      },
      {
        id: "m-001-05",
        senderId: "me",
        text: "can someone sanity-check the invite flow too?",
        sentAt: "9:12 AM",
      },
      {
        id: "m-001-06",
        senderId: "f-004",
        text: "on it",
        sentAt: "9:13 AM",
      },
      {
        id: "m-001-07",
        senderId: "f-004",
        text: "the new copy feels much clearer btw",
        sentAt: "9:19 AM",
      },
      {
        id: "m-001-08",
        senderId: "f-006",
        text: "agree, especially the permissions step",
        sentAt: "9:21 AM",
      },
      {
        id: "m-001-09",
        senderId: "me",
        text: "perfect, marking that section done ✅",
        sentAt: "9:24 AM",
      },
      {
        id: "m-001-10",
        senderId: "f-001",
        text: "lunch after the dry run?",
        sentAt: "11:48 AM",
      },
      {
        id: "m-001-11",
        senderId: "me",
        text: "absolutely",
        sentAt: "11:49 AM",
      },
      {
        id: "m-001-12",
        senderId: "f-006",
        text: "found one tiny spacing issue on the member sheet",
        sentAt: "2:15 PM",
      },
      {
        id: "m-001-13",
        senderId: "f-006",
        text: "nothing blocking",
        sentAt: "2:15 PM",
      },
      {
        id: "m-001-14",
        senderId: "me",
        text: "send a screenshot and I'll grab it",
        sentAt: "2:17 PM",
      },
      {
        id: "m-001-15",
        senderId: "f-004",
        text: "tomorrow's build should be the one we share with everyone",
        sentAt: "6:42 PM",
        dateDividerLabel: "Friday, May 15, 2026",
      },
      {
        id: "m-001-16",
        senderId: "f-001",
        text: "I added the last two illustrations",
        sentAt: "6:44 PM",
      },
      {
        id: "m-001-17",
        senderId: "me",
        text: "just saw them, they look great",
        sentAt: "6:45 PM",
      },
      {
        id: "m-001-18",
        senderId: "f-006",
        text: "android smoke test is green",
        sentAt: "7:01 PM",
      },
      {
        id: "m-001-19",
        senderId: "f-004",
        text: "iOS too 🎉",
        sentAt: "7:03 PM",
      },
      {
        id: "m-001-20",
        senderId: "me",
        text: "shipping snacks are officially earned",
        sentAt: "7:05 PM",
      },
      {
        id: "m-001-1",
        senderId: "f-004",
        text: "locked the room so randos can't drop in",
        sentAt: "4:56 PM",
        dateDividerLabel: "Saturday, May 16, 2026",
      },
      {
        id: "m-001-2",
        senderId: "me",
        text: "?",
        sentAt: "5:15 PM",
      },
      {
        id: "m-001-3",
        senderId: "f-006",
        text: "??",
        sentAt: "5:18 PM",
      },
      {
        id: "m-001-4",
        senderId: "f-006",
        text: "kinda cheap tho",
        sentAt: "5:19 PM",
      },
      {
        id: "m-001-5",
        senderId: "f-006",
        text: "should be at least $57",
        sentAt: "5:19 PM",
      },
      {
        id: "m-001-6",
        senderId: "me",
        text: "legendary once it ships",
        sentAt: "5:19 PM",
      },
      {
        id: "m-001-7",
        senderId: "f-001",
        text: "why ignore the other shops and only push back on this one",
        sentAt: "10:14 AM",
        dateDividerLabel: "Sunday, May 17, 2026",
      },
      {
        id: "m-001-8",
        senderId: "f-001",
        text: "they're really clamping down on it 🤦",
        sentAt: "10:15 AM",
      },
      {
        id: "m-001-21",
        senderId: "f-004",
        text: "wait, did the access rules change again?",
        sentAt: "10:11 AM",
        dateDividerLabel: "Monday, May 18, 2026",
      },
      {
        id: "m-001-22",
        senderId: "me",
        text: "looks like the public link got disabled overnight",
        sentAt: "10:12 AM",
      },
      {
        id: "m-001-23",
        senderId: "f-006",
        text: "why is everyone gatekeeping the new build",
        sentAt: "10:15 AM",
      },
    ],
  },
  {
    id: "c-002",
    friendId: "f-003",
    partnerName: "Riley Sato 🌷",
    partnerAvatar: "https://picsum.photos/seed/kakao-riley/200/200",
    lastMessage: "those photos came out so good 😊",
    lastMessageAt: "12:40 PM",
    unreadCount: 0,
    messages: [
      {
        id: "m-002-1",
        senderId: "f-003",
        text: "can you send me the pics from yesterday",
        sentAt: "11:50 AM",
      },
      {
        id: "m-002-2",
        senderId: "me",
        text: "yep give me a sec",
        sentAt: "11:52 AM",
      },
      {
        id: "m-002-3",
        senderId: "me",
        text: "here's the album",
        sentAt: "12:30 PM",
        imageUrl: "https://picsum.photos/seed/kakao-photo-1/400/300",
      },
      {
        id: "m-002-4",
        senderId: "f-003",
        text: "those photos came out so good 😊",
        sentAt: "12:40 PM",
      },
    ],
  },
  {
    id: "c-003",
    friendId: "f-001",
    partnerName: "Mia Chen",
    partnerAvatar: "https://picsum.photos/seed/kakao-mia/200/200",
    lastMessage: "thank you for the birthday wishes!! 🥹",
    lastMessageAt: "9:22 AM",
    unreadCount: 1,
    messages: [
      {
        id: "m-003-1",
        senderId: "me",
        text: "happy birthday 🎉🎂",
        sentAt: "9:00 AM",
      },
      {
        id: "m-003-2",
        senderId: "f-001",
        text: "thank you for the birthday wishes!! 🥹",
        sentAt: "9:22 AM",
      },
    ],
  },
  {
    id: "c-004",
    friendId: "f-004",
    partnerName: "Study Buddies",
    partnerAvatar: "https://picsum.photos/seed/kakao-group-2/200/200",
    lastMessage: "Sam: 7pm tonight, same plan?",
    lastMessageAt: "Yesterday",
    unreadCount: 12,
    memberCount: 6,
    messages: [
      {
        id: "m-004-1",
        senderId: "f-004",
        text: "7pm tonight, same plan?",
        sentAt: "Yesterday 6:30 PM",
      },
    ],
  },
  {
    id: "c-005",
    friendId: "f-005",
    partnerName: "Noa Lindqvist",
    partnerAvatar: "https://picsum.photos/seed/kakao-noa/200/200",
    lastMessage: "walk pic 🐶",
    lastMessageAt: "Yesterday",
    unreadCount: 0,
    messages: [
      {
        id: "m-005-1",
        senderId: "f-005",
        text: "walk pic 🐶",
        sentAt: "Yesterday 5:10 PM",
      },
    ],
  },
  {
    id: "c-006",
    friendId: "f-006",
    partnerName: "Devon Hale",
    partnerAvatar: "https://picsum.photos/seed/kakao-devon/200/200",
    lastMessage: "ok see you tomorrow",
    lastMessageAt: "5/14",
    unreadCount: 0,
    messages: [
      {
        id: "m-006-1",
        senderId: "f-006",
        text: "ok see you tomorrow",
        sentAt: "5/14 11:30 PM",
      },
    ],
  },
  {
    id: "c-007",
    friendId: "f-007",
    partnerName: "Kira Velez",
    partnerAvatar: "https://picsum.photos/seed/kakao-kira/200/200",
    lastMessage: "[Photo]",
    lastMessageAt: "5/12",
    unreadCount: 0,
    messages: [
      {
        id: "m-007-1",
        senderId: "f-007",
        text: "today's workout",
        sentAt: "5/12 7:30 AM",
        imageUrl: "https://picsum.photos/seed/kakao-gym/400/300",
      },
    ],
  },
];

const pinnedIds = new Set(["c-001", "c-002", "c-003", "c-004"]);
const mutedIds = new Set(["c-006", "c-007"]);

/** 그룹방 대화상대 (나 제외). 1:1 방은 friendId 한 명 */
const GROUP_MEMBERS: Record<string, string[]> = {
  "c-001": ["f-004", "f-006", "f-001"],
  "c-004": ["f-004", "f-002", "f-003", "f-005", "f-007"],
};

/** 채팅 화면에서 쓰는 사람 정보 — 이름(방 제목), 짧은 이름(말풍선), 아바타 */
const PEOPLE: Record<string, { name: string; short: string; avatar: string }> =
  {
    me: {
      name: "Alex Rivera",
      short: "나",
      avatar: "https://picsum.photos/seed/kakao-me/200/200",
    },
    "f-001": {
      name: "Mia Chen 🎂",
      short: "Mia",
      avatar: "https://picsum.photos/seed/kakao-mia/200/200",
    },
    "f-002": {
      name: "Jordan Park ☕️",
      short: "Jordan",
      avatar: "https://picsum.photos/seed/kakao-jordan/200/200",
    },
    "f-003": {
      name: "Riley Sato 🌷",
      short: "Riley",
      avatar: "https://picsum.photos/seed/kakao-riley/200/200",
    },
    "f-004": {
      name: "Sam Okafor",
      short: "Sam",
      avatar: "https://picsum.photos/seed/kakao-sam/200/200",
    },
    "f-005": {
      name: "Noa Lindqvist",
      short: "Noa",
      avatar: "https://picsum.photos/seed/kakao-noa/200/200",
    },
    "f-006": {
      name: "Devon Hale",
      short: "Devon",
      avatar: "https://picsum.photos/seed/kakao-devon/200/200",
    },
    "f-007": {
      name: "Kira Velez",
      short: "Kira",
      avatar: "https://picsum.photos/seed/kakao-kira/200/200",
    },
    "f-008": {
      name: "Theo Brandt",
      short: "Theo",
      avatar: "https://picsum.photos/seed/kakao-theo/200/200",
    },
    "f-009": {
      name: "Ivy Nakamura",
      short: "Ivy",
      avatar: "https://picsum.photos/seed/kakao-ivy/200/200",
    },
    "f-010": {
      name: "Marco Ruiz",
      short: "Marco",
      avatar: "https://picsum.photos/seed/kakao-marco/200/200",
    },
  };

const isGroup = (t: ChatThreadDetail) => Boolean(t.memberCount);

function toSimple(t: ChatThreadDetail): ChatThreadSimple {
  const { messages, friendId, ...rest } = t;
  void messages;
  return {
    ...rest,
    pinned: pinnedIds.has(t.id),
    muted: mutedIds.has(t.id),
    profileId: isGroup(t) ? undefined : friendId,
  };
}

function matchesFilter(t: ChatThreadDetail, filter?: ThreadFilter) {
  return !filter?.unreadOnly || t.unreadCount > 0;
}

function memberIdsOf(t: ChatThreadDetail): string[] {
  if (GROUP_MEMBERS[t.id]) return GROUP_MEMBERS[t.id];
  if (t.id.startsWith("g-")) return t.id.slice(2).split("_");
  return t.friendId === "me" ? [] : [t.friendId];
}

/** 목록에 없는 방 — 친구와의 빈 1:1 방(dm-<id>)이나 새로 만든 그룹방(g-<id>_<id>) */
function synthesize(id: string): ChatThreadDetail | null {
  const blank = { lastMessage: "", lastMessageAt: "", unreadCount: 0 };
  if (id.startsWith("dm-")) {
    const friendId = id.slice(3);
    const person = PEOPLE[friendId];
    if (!person) return null;
    return {
      ...blank,
      id,
      friendId,
      partnerName: person.name,
      partnerAvatar: person.avatar,
      messages:
        friendId === "me"
          ? [
              systemNotice(
                `${id}-notice`,
                "나와의 채팅에 메모, 할 일, 링크를 보관해 보세요.",
              ),
            ]
          : [],
    };
  }
  if (id.startsWith("g-")) {
    const ids = id.slice(2).split("_");
    if (ids.length < 2 || ids.some((f) => f === "me" || !PEOPLE[f])) {
      return null;
    }
    return {
      ...blank,
      id,
      friendId: ids[0],
      partnerName: ids.map((f) => PEOPLE[f].short).join(", "),
      partnerAvatar: PEOPLE[ids[0]].avatar,
      memberCount: ids.length + 1,
      messages: [
        systemNotice(
          `${id}-notice`,
          `${PEOPLE.me.name}님이 ${ids.map((f) => `${plainName(f)}님`).join(", ")}을 초대했습니다.`,
        ),
      ],
    };
  }
  return null;
}

/** 안내 문구용 이름 — 뒤에 붙은 이모지를 뗀다 ("Mia Chen 🎂" → "Mia Chen") */
const plainName = (id: string) =>
  PEOPLE[id].name.replace(/\s*\p{Extended_Pictographic}.*$/u, "");

/** 새로 만든 방의 안내 문구 — 목록의 마지막 날짜에 붙인다 */
function systemNotice(id: string, text: string): ChatMessage {
  return {
    id,
    senderId: "system",
    text,
    sentAt: "",
    dateDividerLabel: "Monday, May 18, 2026",
  };
}

function rawById(id: string): ChatThreadDetail | null {
  return threads.find((t) => t.id === id) ?? synthesize(id);
}

function dmThreadIdFor(friendId: string): string | null {
  if (!PEOPLE[friendId]) return null;
  const existing = threads.find((t) => t.friendId === friendId && !isGroup(t));
  return existing?.id ?? `dm-${friendId}`;
}

export const data = {
  pinned: (filter?: ThreadFilter): ChatThreadSimple[] =>
    threads
      .filter((t) => pinnedIds.has(t.id) && matchesFilter(t, filter))
      .map(toSimple),
  recent: (filter?: ThreadFilter): ChatThreadSimple[] =>
    threads
      .filter((t) => !pinnedIds.has(t.id) && matchesFilter(t, filter))
      .map(toSimple),
  /** 이름·마지막 메시지 검색. 빈 검색어면 최근 대화 4개 */
  search: (q: string): ChatThreadSimple[] => {
    const needle = q.trim().toLowerCase();
    if (!needle) return threads.slice(0, 4).map(toSimple);
    return threads
      .filter(
        (t) =>
          t.partnerName.toLowerCase().includes(needle) ||
          t.lastMessage.toLowerCase().includes(needle),
      )
      .map(toSimple);
  },
  byId: (id: string): ChatThreadDetail | null => {
    const found = rawById(id);
    if (!found) return null;
    return {
      ...found,
      messages: decorateMessages(found.messages),
    };
  },
  drawer: (id: string): ChatDrawer | null => {
    const t = rawById(id);
    if (!t) return null;
    const photos = t.messages
      .filter((m) => m.imageUrl)
      .map((m) => ({ id: m.id, imageUrl: m.imageUrl! }))
      .reverse();
    const members: ChatMember[] = [
      { id: "me", name: PEOPLE.me.name, avatar: PEOPLE.me.avatar, isMe: true },
      ...memberIdsOf(t).map((f) => ({
        id: f,
        name: PEOPLE[f].name,
        avatar: PEOPLE[f].avatar,
        isMe: false,
      })),
    ];
    return {
      id: t.id,
      partnerName: t.partnerName,
      muted: mutedIds.has(t.id),
      pinned: pinnedIds.has(t.id),
      photos,
      photosLabel: `사진·동영상 ${photos.length}`,
      members,
      membersLabel: `대화상대 ${members.length}`,
    };
  },
  photo: (threadId: string, messageId: string): ChatPhoto | null => {
    const m = rawById(threadId)?.messages.find((x) => x.id === messageId);
    if (!m?.imageUrl) return null;
    return {
      threadId,
      messageId,
      imageUrl: m.imageUrl,
      senderName:
        m.senderId === "me" ? "나" : (PEOPLE[m.senderId]?.name ?? "Friend"),
      sentAt: m.sentAt,
    };
  },
  dmThreadIdFor,
  /** 한 명이면 1:1 방, 여럿이면 같은 멤버의 그룹방 — 없으면 새 그룹방 */
  roomWith: (friendIds: string[]): string | null => {
    const ids = Object.keys(PEOPLE).filter(
      (f) => f !== "me" && friendIds.includes(f),
    );
    if (ids.length === 0) return null;
    if (ids.length === 1) return dmThreadIdFor(ids[0]);
    const key = [...ids].sort().join(",");
    const group = Object.entries(GROUP_MEMBERS).find(
      ([, members]) => [...members].sort().join(",") === key,
    );
    return group?.[0] ?? `g-${ids.join("_")}`;
  },
  /** 내가 보낸 메시지 — 연속 발화 표시까지 계산해서 돌려준다 */
  sentMessage: (text: string, at: Date): ChatMessage => ({
    id: `m-sent-${at.getTime()}`,
    senderId: "me",
    text,
    sentAt: at.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }),
    showSenderInfo: false,
    readIndicator: "1",
  }),
};

function decorateMessages(messages: ChatThreadDetail["messages"]) {
  let prevSenderId: string | null = null;
  return messages.map((m) => {
    if (m.senderId === "system") return m;
    const isMe = m.senderId === "me";
    const showSenderInfo = !isMe && m.senderId !== prevSenderId;
    prevSenderId = m.senderId;
    return {
      ...m,
      senderName: isMe ? undefined : (PEOPLE[m.senderId]?.short ?? "Friend"),
      senderAvatar: isMe ? undefined : PEOPLE[m.senderId]?.avatar,
      showSenderInfo,
      readIndicator: "1",
    };
  });
}
