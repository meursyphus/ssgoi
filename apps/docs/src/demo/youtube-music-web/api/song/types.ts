export type SongCard = {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
  /** Plays for hero variant */
  plays?: string;
  /** Subtitle override for non-song shelves (e.g. "Episode • Today") */
  subtitle?: string;
};

export type HomeShelf = {
  id: string;
  title: string;
  /** "row" — horizontal carousel · "grid" — quick-pick 2x2 · "list" — vertical list */
  kind: "row" | "grid" | "list";
  items: SongCard[];
};

export type HeroFeature = {
  id: string;
  /** Top eyebrow label e.g. "MIX FOR YOU" */
  eyebrow: string;
  title: string;
  subtitle: string;
  thumbnail: string;
  /** Side list shown next to hero. e.g. "Forgotten favorites" */
  sideTitle: string;
  sideItems: SongCard[];
};

export type HomeData = {
  hero: HeroFeature;
  shelves: HomeShelf[];
};

export type SongDetail = SongCard & {
  album: string;
  releaseYear: number;
  description: string;
  /** Up next queue */
  upNext: SongCard[];
  /** Lyrics preview (a few stanzas) */
  lyrics: string;
};

export interface SongAPI {
  home: () => Promise<HomeData>;
  find: (id: string) => Promise<SongDetail>;
}
