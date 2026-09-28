export interface PinAPI {
  /** Home feed; `board` narrows it to one of the user's boards ("모두" = all). */
  findAll: (filter?: FindAllFilter) => Promise<PinSimple[]>;
  find: (id: string) => Promise<PinDetail>;
  search: (query: string) => Promise<PinSimple[]>;
  /** Guided-search chips that refine `query`, minus the terms already in it. */
  findGuides: (query: string) => Promise<Guide[]>;
  /** The mock user's profile header and boards. */
  findProfile: () => Promise<Profile>;
  /** Pins the mock user saved, newest first. */
  findSaved: () => Promise<PinSimple[]>;
  /** Inbox updates; each one points at an existing pin. */
  findUpdates: () => Promise<InboxUpdate[]>;
  /** Share sheet for one pin: preview + people to send it to. */
  findShare: (id: string) => Promise<ShareSheet>;
}

export type FindAllFilter = {
  board?: string;
};

export type Author = {
  name: string;
  avatar: string;
  followers: number;
  bio: string;
};

export type PinSimple = {
  id: string;
  title: string;
  image: string;
  aspectRatio: string;
  category: string;
  saves: number;
  author: Author;
};

export type PinDetail = PinSimple & {
  description: string;
  tags: string[];
  domain: string;
};

export type Guide = {
  label: string;
  thumb: string;
  tint: "pink" | "slate" | "lilac";
};

export type Board = {
  name: string;
  pinCount: number;
  /** Relative time since the last save, e.g. "2일". */
  updated: string;
  /** Cover collage: one large and two small images. */
  covers: string[];
};

export type Profile = {
  name: string;
  handle: string;
  avatar: string;
  followers: number;
  following: number;
  boards: Board[];
};

export type InboxUpdate = {
  id: string;
  /** Person the update is about; null for Pinterest's own suggestions. */
  actor: { name: string; avatar: string } | null;
  /** Sentence shown after the actor's name. */
  message: string;
  time: string;
  isNew: boolean;
  pin: Pick<PinSimple, "id" | "title" | "image" | "aspectRatio">;
};

export type ShareSheet = {
  pin: PinSimple;
  /** People to send the pin to; `shortName` fits under the avatar. */
  contacts: { name: string; shortName: string; avatar: string }[];
};
