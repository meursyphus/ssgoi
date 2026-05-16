import type { SongDetail } from "@/demo/youtube-music-web/api/song";

export type SongState = {
  current: SongDetail | null;
  /** Now-playing tab — Up next / Lyrics / Related */
  tab: "up-next" | "lyrics" | "related";
};

export type SongActions = {
  init(detail: SongDetail): void;
  setTab(tab: SongState["tab"]): void;
  play(id: string): void;
};

export type { SongDetail };
