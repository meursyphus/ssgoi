export interface CategoryAPI {
  findAll: () => Promise<RecommendedCategory[]>;
}

export type RecommendedCategory = {
  /** category label used as the search query / drill key */
  label: string;
  /** badge above the label, e.g. "추천 아이디어" */
  badge: string;
  /** thumbnails for the horizontal preview strip */
  thumbnails: string[];
};
