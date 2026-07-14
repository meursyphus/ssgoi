import type { ChatThreadDetail, ChatThreadSimple } from "./types";

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

function toSimple(t: ChatThreadDetail): ChatThreadSimple {
  const { messages, friendId, ...rest } = t;
  void messages;
  void friendId;
  return {
    ...rest,
    pinned: pinnedIds.has(t.id),
    muted: mutedIds.has(t.id),
  };
}

export const data = {
  pinned: (): ChatThreadSimple[] =>
    threads.filter((t) => pinnedIds.has(t.id)).map(toSimple),
  recent: (): ChatThreadSimple[] =>
    threads.filter((t) => !pinnedIds.has(t.id)).map(toSimple),
  byId: (id: string): ChatThreadDetail | null => {
    const found = threads.find((t) => t.id === id);
    if (!found) return null;
    return {
      ...found,
      messages: decorateMessages(found.messages),
    };
  },
};

const SENDER_NAMES: Record<string, string> = {
  "f-001": "Mia",
  "f-002": "Jordan",
  "f-003": "Riley",
  "f-004": "Sam",
  "f-005": "Noa",
  "f-006": "Devon",
  "f-007": "Kira",
};

const SENDER_AVATARS: Record<string, string> = {
  "f-001": "https://picsum.photos/seed/kakao-mia/200/200",
  "f-002": "https://picsum.photos/seed/kakao-jordan/200/200",
  "f-003": "https://picsum.photos/seed/kakao-riley/200/200",
  "f-004": "https://picsum.photos/seed/kakao-sam/200/200",
  "f-005": "https://picsum.photos/seed/kakao-noa/200/200",
  "f-006": "https://picsum.photos/seed/kakao-devon/200/200",
  "f-007": "https://picsum.photos/seed/kakao-kira/200/200",
};

function decorateMessages(messages: ChatThreadDetail["messages"]) {
  let prevSenderId: string | null = null;
  return messages.map((m) => {
    const isMe = m.senderId === "me";
    const showSenderInfo = !isMe && m.senderId !== prevSenderId;
    prevSenderId = m.senderId;
    return {
      ...m,
      senderName: isMe ? undefined : (SENDER_NAMES[m.senderId] ?? "Friend"),
      senderAvatar: isMe ? undefined : SENDER_AVATARS[m.senderId],
      showSenderInfo,
      readIndicator: "1",
    };
  });
}
