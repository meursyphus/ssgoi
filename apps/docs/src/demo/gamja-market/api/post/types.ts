export interface PostAPI {
  /** 동네생활 feed, newest first, with the group-buy item each post talks about. */
  findAll: () => Promise<PostSimple[]>;
}

export type PostProduct = {
  id: string;
  name: string;
  thumbnail: string;
  price: number;
};

export type PostSimple = {
  id: string;
  category: string;
  title: string;
  body: string;
  author: string;
  region: string;
  /** "2시간 전" */
  time: string;
  likeCount: number;
  commentCount: number;
  product: PostProduct | null;
};
