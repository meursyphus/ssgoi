export type MockVideo = {
  title: string;
  channel: string;
  meta: string;
  image: string;
  duration?: string;
};

export const shortVideos: MockVideo[] = [
  {
    title: "The tiny desk setup that fixed my focus",
    channel: "Maya Builds",
    meta: "1.2M views",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&h=920&q=80",
  },
  {
    title: "A sunset concert in thirty seconds",
    channel: "Field Notes",
    meta: "842K views",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&h=920&q=80",
  },
  {
    title: "Three plating tricks from a pastry chef",
    channel: "Studio Kitchen",
    meta: "603K views",
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&h=920&q=80",
  },
  {
    title: "Why this building stays cool all summer",
    channel: "New Architecture",
    meta: "2.4M views",
    image:
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=600&h=920&q=80",
  },
];

export const feedVideos: MockVideo[] = [
  {
    title: "I rebuilt my workspace for deep work",
    channel: "Maya Builds",
    meta: "418K views · 2 days ago",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1100&h=620&q=80",
    duration: "12:48",
  },
  {
    title: "A quiet morning in the mountains",
    channel: "Field Notes",
    meta: "2.1M views · 1 week ago",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1100&h=620&q=80",
    duration: "18:06",
  },
  {
    title: "Five weeknight recipes worth saving",
    channel: "Studio Kitchen",
    meta: "780K views · 4 days ago",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1100&h=620&q=80",
    duration: "15:22",
  },
];

export const channels = [
  {
    name: "Maya Builds",
    image: "https://picsum.photos/seed/yt-maya/160/160",
  },
  {
    name: "Field Notes",
    image: "https://picsum.photos/seed/yt-field/160/160",
  },
  {
    name: "Studio Kitchen",
    image: "https://picsum.photos/seed/yt-kitchen/160/160",
  },
  {
    name: "Open Studio",
    image: "https://picsum.photos/seed/yt-studio/160/160",
  },
  {
    name: "New Architecture",
    image: "https://picsum.photos/seed/yt-architecture/160/160",
  },
] as const;

export const historyVideos: MockVideo[] = [
  {
    title: "Design details you notice every day",
    channel: "Open Studio",
    meta: "Playlist",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=620&h=350&q=80",
  },
  {
    title: "An afternoon mix for making things",
    channel: "Field Notes",
    meta: "2:10:23",
    image:
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=620&h=350&q=80",
  },
  {
    title: "The best city walks this year",
    channel: "Maya Builds",
    meta: "Playlist",
    image:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=620&h=350&q=80",
  },
];
