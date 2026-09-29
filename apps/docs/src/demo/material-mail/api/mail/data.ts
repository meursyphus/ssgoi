import type { Category, MailSimple } from "./types";

type Folder = Category | "sent";
type Location = "inbox" | "archive" | "trash";

export type SeedMail = Omit<MailSimple, "hasAttachment"> & {
  folder: Folder;
  location: Location;
  /** minutes ago — orders mixed mailboxes such as All mail */
  age: number;
  /** full timestamp for the conversation header */
  sentAt: string;
  /** explicit address for non-person senders; people derive one from their name */
  email?: string;
  /** sent mail only: who it went to */
  recipient?: string;
  /** body paragraphs after the preview line */
  extra: string[];
  sign: string;
  attachment?: { name: string; size: string };
};

export const ME = { name: "Minseo Kang", email: "me@example.com" };

const seed: SeedMail[] = [
  {
    id: "m-001",
    sender: "Alice Chen",
    senderInitial: "A",
    senderColor: "bg-rose-500",
    subject: "Project update for Q2",
    preview:
      "Hi! Quick update on the Q2 roadmap. We've reshuffled the milestones and I'd love your take before Friday.",
    timeLabel: "3 min",
    unread: true,
    starred: false,
    folder: "primary",
    location: "inbox",
    age: 3,
    sentAt: "May 28, 10:41 AM",
    extra: [
      "The biggest change: search moves up to May and the billing revamp slides to July, so design has room to finish the new settings flow.",
      "The updated timeline is attached. Comments in the doc are fine, or grab 15 minutes with me on Thursday.",
    ],
    sign: "Alice",
    attachment: { name: "Q2-roadmap-v3.pdf", size: "1.2 MB" },
  },
  {
    id: "t-001",
    sender: "Ben Karim",
    senderInitial: "B",
    senderColor: "bg-amber-500",
    subject: "Re: Lunch tomorrow?",
    preview: "12:30 works for me. Meet you in the lobby?",
    timeLabel: "50 min",
    unread: false,
    starred: false,
    folder: "sent",
    location: "inbox",
    age: 50,
    sentAt: "May 28, 9:54 AM",
    recipient: "Ben Karim",
    extra: ["I've heard the spicy miso is the one to get."],
    sign: "Minseo",
  },
  {
    id: "m-002",
    sender: "Ben Karim",
    senderInitial: "B",
    senderColor: "bg-amber-500",
    subject: "Lunch tomorrow?",
    preview:
      "Are you free around 12:30? There's a new ramen place near the office I want to try.",
    timeLabel: "1 h",
    unread: true,
    starred: false,
    folder: "primary",
    location: "inbox",
    age: 60,
    sentAt: "May 28, 9:44 AM",
    extra: [
      "They only take walk-ins, so if we leave at 12:20 we should beat the line.",
      "I'll grab Daniel too if he's around.",
    ],
    sign: "Ben",
  },
  {
    id: "m-003",
    sender: "Carol Park",
    senderInitial: "C",
    senderColor: "bg-teal-500",
    subject: "Receipts for May",
    preview:
      "Forwarding the receipts for May. Let me know if any of them need to be re-categorized.",
    timeLabel: "2 h",
    unread: false,
    starred: false,
    folder: "primary",
    location: "inbox",
    age: 120,
    sentAt: "May 28, 8:44 AM",
    extra: [
      "There are 14 in total, mostly travel and the two team dinners. The Busan hotel is split across two cards.",
      "Everything needs to be in the expense tool by the 5th.",
    ],
    sign: "Carol",
    attachment: { name: "may-receipts.zip", size: "4.8 MB" },
  },
  {
    id: "s-001",
    sender: "Trailmates",
    senderInitial: "T",
    senderColor: "bg-green-600",
    subject: "Mina invited you to a hike on Saturday",
    preview: "Bukhansan · 8 km · meet at 8:00 AM at Gupabal station, exit 1.",
    timeLabel: "3 h",
    unread: true,
    starred: false,
    folder: "social",
    location: "inbox",
    age: 180,
    sentAt: "May 28, 7:40 AM",
    email: "noreply@trailmates.example",
    extra: [
      "7 people are going. Bring water and a light jacket; it gets windy near the ridge.",
    ],
    sign: "The Trailmates team",
  },
  {
    id: "m-004",
    sender: "Daniel Lim",
    senderInitial: "D",
    senderColor: "bg-indigo-500",
    subject: "Re: launch checklist",
    preview:
      "Looks great. Two small things on the rollback step — replying inline below.",
    timeLabel: "4 h",
    unread: false,
    starred: true,
    folder: "primary",
    location: "inbox",
    age: 240,
    sentAt: "May 28, 6:43 AM",
    extra: [
      "1. The rollback step should name who flips the flag, not just the flag.",
      "2. Let's post the status-page update before the announcement, not after.",
      "Otherwise, ship it.",
    ],
    sign: "Daniel",
  },
  {
    id: "p-001",
    sender: "Brewline Coffee",
    senderInitial: "B",
    senderColor: "bg-stone-600",
    subject: "Your birthday drink is on us",
    preview:
      "Show this email at any Brewline store before May 31 to redeem one handcrafted drink, any size.",
    timeLabel: "6 h",
    unread: true,
    starred: false,
    folder: "promotions",
    location: "inbox",
    age: 360,
    sentAt: "May 28, 4:40 AM",
    email: "hello@brewline.example",
    extra: ["Add a pastry for ₩2,000 when you redeem in store."],
    sign: "The Brewline team",
  },
  {
    id: "m-005",
    sender: "Elena Rossi",
    senderInitial: "E",
    senderColor: "bg-pink-500",
    subject: "Welcome to the team",
    preview:
      "So glad to have you with us! Here are a few onboarding docs and the calendar invite for Monday.",
    timeLabel: "Yesterday",
    unread: false,
    starred: false,
    folder: "primary",
    location: "inbox",
    age: 1440,
    sentAt: "May 27, 5:12 PM",
    extra: [
      "Your laptop will be at the front desk on Monday at 9. After that, the first thing on the calendar is a team coffee at 10:30.",
      "No need to prepare anything. Just bring your questions.",
    ],
    sign: "Elena",
  },
  {
    id: "m-006",
    sender: "Frank Wu",
    senderInitial: "F",
    senderColor: "bg-emerald-500",
    subject: "Quarterly figures",
    preview:
      "Attaching the figures for Q1. Numbers look strong on engagement but conversion is flat.",
    timeLabel: "Yesterday",
    unread: false,
    starred: false,
    folder: "primary",
    location: "inbox",
    age: 1500,
    sentAt: "May 27, 4:02 PM",
    extra: [
      "Weekly actives are up 18% quarter over quarter, but checkout conversion stayed at 3.1%.",
      "I'd like to go through the funnel together before the board deck is due.",
    ],
    sign: "Frank",
    attachment: { name: "Q1-figures.xlsx", size: "860 KB" },
  },
  {
    id: "p-002",
    sender: "Nimbus Air",
    senderInitial: "N",
    senderColor: "bg-blue-600",
    subject: "Fares to Jeju from ₩39,000",
    preview:
      "Book by Sunday for summer travel. Limited seats on weekday departures from Gimpo.",
    timeLabel: "Yesterday",
    unread: false,
    starred: false,
    folder: "promotions",
    location: "inbox",
    age: 1560,
    sentAt: "May 27, 3:00 PM",
    email: "deals@nimbusair.example",
    extra: [
      "Fares include one checked bag and seat selection. Prices shown are one way.",
    ],
    sign: "Nimbus Air",
  },
  {
    id: "t-002",
    sender: "Daniel Lim",
    senderInitial: "D",
    senderColor: "bg-indigo-500",
    subject: "Launch checklist v3",
    preview:
      "Attaching the updated checklist with the rollback step split into its own section.",
    timeLabel: "Yesterday",
    unread: false,
    starred: false,
    folder: "sent",
    location: "inbox",
    age: 1600,
    sentAt: "May 27, 2:18 PM",
    recipient: "Daniel Lim",
    extra: ["Could you give it one more pass before Thursday's go/no-go?"],
    sign: "Minseo",
    attachment: { name: "launch-checklist-v3.pdf", size: "340 KB" },
  },
  {
    id: "m-007",
    sender: "Grace Müller",
    senderInitial: "G",
    senderColor: "bg-sky-500",
    subject: "Out of office: 5/24 – 5/31",
    preview:
      "I'll be out next week — please reach out to Jack for anything urgent during that window.",
    timeLabel: "Mon",
    unread: true,
    starred: false,
    folder: "primary",
    location: "inbox",
    age: 2880,
    sentAt: "May 26, 9:00 AM",
    extra: [
      "I'll have limited access to email and will reply when I'm back on June 2.",
    ],
    sign: "Grace",
  },
  {
    id: "m-008",
    sender: "Henry Tan",
    senderInitial: "H",
    senderColor: "bg-violet-500",
    subject: "Notion workspace invite",
    preview:
      "You've been invited to the Product workspace. Click the link to accept — no signup required.",
    timeLabel: "Mon",
    unread: false,
    starred: false,
    folder: "primary",
    location: "inbox",
    age: 2900,
    sentAt: "May 26, 8:31 AM",
    extra: [
      "It has the roadmap, the design review notes and the launch runbook. You'll land in the Product teamspace.",
    ],
    sign: "Henry",
  },
  {
    id: "s-002",
    sender: "Seoul Tech Meetup",
    senderInitial: "S",
    senderColor: "bg-red-500",
    subject: "New event: Motion design for the web",
    preview:
      "Join 120 others on June 4 at 7 PM for talks on spring physics and shared-element transitions.",
    timeLabel: "Mon",
    unread: false,
    starred: false,
    folder: "social",
    location: "inbox",
    age: 2950,
    sentAt: "May 26, 7:30 AM",
    email: "events@seoultech.example",
    extra: [
      "Doors open at 6:30 PM. Pizza is on the house, and the talks will be recorded.",
    ],
    sign: "Seoul Tech Meetup",
  },
  {
    id: "m-009",
    sender: "Iris Park",
    senderInitial: "I",
    senderColor: "bg-orange-500",
    subject: "Re: design review feedback",
    preview:
      "Appreciate the detailed notes. I'll fold the spacing fixes into the next Figma pass tonight.",
    timeLabel: "Sun",
    unread: false,
    starred: false,
    folder: "primary",
    location: "inbox",
    age: 4320,
    sentAt: "May 25, 8:47 PM",
    extra: [
      "I'll also try the tighter card radius you suggested and share both versions tomorrow morning.",
    ],
    sign: "Iris",
  },
  {
    id: "p-003",
    sender: "Paper & Pine",
    senderInitial: "P",
    senderColor: "bg-lime-700",
    subject: "New arrivals: linen notebooks",
    preview:
      "Hand-bound, lay-flat and made from recycled cotton. Free shipping on orders over ₩30,000.",
    timeLabel: "Sun",
    unread: false,
    starred: false,
    folder: "promotions",
    location: "inbox",
    age: 4400,
    sentAt: "May 25, 11:00 AM",
    email: "shop@paperandpine.example",
    extra: [
      "Available in sand, moss and ink. Embossing your initials is free this week.",
    ],
    sign: "Paper & Pine",
  },
  {
    id: "m-010",
    sender: "Jack Doh",
    senderInitial: "J",
    senderColor: "bg-cyan-500",
    subject: "Action items from sync",
    preview:
      "Recapping what we landed on this morning. Three owners assigned — let me know if anything looks off.",
    timeLabel: "Sat",
    unread: false,
    starred: true,
    folder: "primary",
    location: "inbox",
    age: 5760,
    sentAt: "May 24, 11:20 AM",
    extra: [
      "Search polish: Iris, by Wednesday.",
      "Release notes draft: Ben, by Thursday.",
      "Maintenance notice: Leo, before the window opens.",
    ],
    sign: "Jack",
  },
  {
    id: "m-011",
    sender: "Kim Soo",
    senderInitial: "K",
    senderColor: "bg-lime-600",
    subject: "Holiday schedule",
    preview:
      "Sharing the proposed holiday rotation for June through August. Please mark your preferences by Thursday.",
    timeLabel: "5/22",
    unread: false,
    starred: false,
    folder: "primary",
    location: "inbox",
    age: 8640,
    sentAt: "May 22, 3:15 PM",
    extra: [
      "Everyone gets one long weekend in the rotation. Swaps are fine as long as both people note it in the sheet.",
    ],
    sign: "Soo",
  },
  {
    id: "m-012",
    sender: "Leo Park",
    senderInitial: "L",
    senderColor: "bg-fuchsia-500",
    subject: "System maintenance window",
    preview:
      "Heads up: scheduling a 30-minute maintenance window on 5/26 at 02:00 KST. No customer impact expected.",
    timeLabel: "5/20",
    unread: false,
    starred: false,
    folder: "primary",
    location: "inbox",
    age: 11520,
    sentAt: "May 20, 6:05 PM",
    extra: [
      "The admin console will be read-only during the window. Alerts go to the on-call channel as usual.",
    ],
    sign: "Leo",
  },
];

export function emailOf(name: string) {
  const local = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .trim()
    .replace(/\s+/g, ".");
  return `${local}@example.com`;
}

const byAge = (a: SeedMail, b: SeedMail) => a.age - b.age;

export const data = {
  all: () => [...seed].sort(byAge).map((m) => ({ ...m })),
  byId: (id: string) => {
    const found = seed.find((m) => m.id === id);
    return found ? { ...found } : null;
  },
  /** In-memory mutation (stars, read state, archive/trash) for the session. */
  update: (
    id: string,
    patch: Partial<Pick<SeedMail, "starred" | "unread" | "location">>,
  ) => {
    const found = seed.find((m) => m.id === id);
    if (!found) return null;
    Object.assign(found, patch);
    return { ...found };
  },
};
