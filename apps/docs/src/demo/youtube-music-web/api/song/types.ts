export type ShelfCard = {
  id: string;
  title: string;
  /** Pre-formatted subtitle line — e.g. "ZICO, Crush, DEAN • 188M plays • RUDE!" */
  subtitle: string;
  thumbnail: string;
};

export type ShelfKind = "quick-picks" | "video-row";

export type Shelf = {
  id: string;
  title: string;
  kind: ShelfKind;
  /** Avatar + name shown above the section heading (e.g. user byline). */
  attribution?: { name: string; avatar: string };
  items: ShelfCard[];
};

export type HomeData = {
  shelves: Shelf[];
};

export type SongDetail = {
  id: string;
  title: string;
  artist: string;
  album: string;
  releaseYear: number;
  duration: string;
  plays: string;
  thumbnail: string;
  description: string;
  upNext: ShelfCard[];
  lyrics: string;
};

export interface SongAPI {
  home: () => Promise<HomeData>;
  find: (id: string) => Promise<SongDetail>;
}
