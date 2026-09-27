import type { Query } from "comwit";
import type {
  PostSimple,
  PostDetail,
  Reel,
  ReelDetail,
  TaggedPost,
} from "@/demo/instagram/api/post";

export type PostState = {
  posts: Query<PostSimple[], void>;
  reels: Query<Reel[], void>;
  tagged: Query<TaggedPost[], void>;
  explore: Query<PostSimple[], void>;
  feed: Query<PostDetail[], void>;
  currentPost: PostDetail | null;
  currentReel: ReelDetail | null;
};

export type PostActions = {
  init(detail: PostDetail): void;
  initReel(detail: ReelDetail): void;
  loadPosts(): Promise<void>;
  loadReels(): Promise<void>;
  loadTagged(): Promise<void>;
  loadExplore(): Promise<void>;
  loadFeed(): Promise<void>;
};

export type {
  PostSimple,
  PostDetail,
  PostAuthor,
  Reel,
  ReelDetail,
  TaggedPost,
  PostKind,
  PostComment,
} from "@/demo/instagram/api/post";
