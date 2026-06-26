export interface StoryAPI {
  findAll: () => Promise<StorySimple[]>;
}

export type StorySimple = {
  id: string;
  title: string;
  /** wide cover photo for the feed card */
  cover: string;
  /** where the trip happened, e.g. "Kyoto, Japan" */
  location: string;
  /** one- or two-line teaser shown under the title */
  excerpt: string;
  author: string;
  authorInitial: string;
  /** tailwind background-color class for the author avatar circle */
  authorColor: string;
  /** pre-formatted timestamp label, e.g. "2d", "1w" */
  timeLabel: string;
  readMinutes: number;
  likes: number;
  saved: boolean;
};
