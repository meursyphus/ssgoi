import type { StorySimple } from "./types";

const cover = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1100&q=80`;

const seed: StorySimple[] = [
  {
    id: "s-001",
    title: "Three slow mornings in the hills above Kyoto",
    cover: cover("photo-1502082553048-f009c37129b9"),
    location: "Kyoto, Japan",
    excerpt:
      "I came for the temples and stayed for the quiet. Every morning began with fog rolling off the bamboo and a cup of matcha I didn't want to finish.",
    author: "Mina Seo",
    authorInitial: "M",
    authorColor: "bg-rose-500",
    timeLabel: "2d",
    readMinutes: 6,
    likes: 248,
    saved: false,
  },
  {
    id: "s-002",
    title: "Chasing the green light over Tromsø",
    cover: cover("photo-1519681393784-d120267933ba"),
    location: "Tromsø, Norway",
    excerpt:
      "We waited four nights in the cold for the aurora. On the fifth, the whole sky cracked open at once and nobody said a word.",
    author: "Idris Vale",
    authorInitial: "I",
    authorColor: "bg-indigo-500",
    timeLabel: "4d",
    readMinutes: 8,
    likes: 1024,
    saved: true,
  },
  {
    id: "s-003",
    title: "A week of long lunches in Tuscany",
    cover: cover("photo-1500382017468-9049fed747ef"),
    location: "Val d'Orcia, Italy",
    excerpt:
      "No itinerary, just a rented Fiat and a list of trattorias from a friend's grandmother. The hills did the rest.",
    author: "Carla Pires",
    authorInitial: "C",
    authorColor: "bg-amber-500",
    timeLabel: "1w",
    readMinutes: 5,
    likes: 512,
    saved: false,
  },
  {
    id: "s-004",
    title: "The trail that almost beat me in Patagonia",
    cover: cover("photo-1469474968028-56623f02e42e"),
    location: "Torres del Paine, Chile",
    excerpt:
      "Day three, the wind was strong enough to lean on. I have never felt smaller or more awake at the same time.",
    author: "Theo Brandt",
    authorInitial: "T",
    authorColor: "bg-emerald-500",
    timeLabel: "1w",
    readMinutes: 11,
    likes: 776,
    saved: false,
  },
  {
    id: "s-005",
    title: "Sunset trams and pastéis in Lisbon",
    cover: cover("photo-1500530855697-b586d89ba3ee"),
    location: "Lisbon, Portugal",
    excerpt:
      "I got beautifully lost in Alfama every single day. The 28 tram became my unreliable, charming compass.",
    author: "June Han",
    authorInitial: "J",
    authorColor: "bg-sky-500",
    timeLabel: "2w",
    readMinutes: 4,
    likes: 333,
    saved: true,
  },
  {
    id: "s-006",
    title: "Glassy water and empty roads on Jeju",
    cover: cover("photo-1584345015538-213f90f9ccbc"),
    location: "Jeju, South Korea",
    excerpt:
      "Rented a tiny car, circled the island clockwise, and stopped at every coastal café that looked like nobody knew about it.",
    author: "Noah Park",
    authorInitial: "N",
    authorColor: "bg-teal-500",
    timeLabel: "3w",
    readMinutes: 7,
    likes: 198,
    saved: false,
  },
  {
    id: "s-007",
    title: "Reflections at the foot of Banff",
    cover: cover("photo-1501785888041-af3ef285b470"),
    location: "Banff, Canada",
    excerpt:
      "The lake was so still it doubled the mountains. We sat on the dock until our coffee went cold, which felt like the point.",
    author: "Elsa Moreau",
    authorInitial: "E",
    authorColor: "bg-violet-500",
    timeLabel: "1mo",
    readMinutes: 6,
    likes: 905,
    saved: false,
  },
];

export const data = {
  all: () => seed.map((s) => ({ ...s })),
};
