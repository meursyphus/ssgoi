import type { Query } from "comwit";
import type {
  PostSimple,
  PostDetail,
  Reel,
  TaggedPost,
} from "@/demo/instagram/api/post";

export type PostState = {
  posts: Query<PostSimple[], void>;
  reels: Query<Reel[], void>;
  tagged: Query<TaggedPost[], void>;
  currentPost: PostDetail | null;
};

export type PostActions = {
  init(detail: PostDetail): void;
  loadPosts(): Promise<void>;
  loadReels(): Promise<void>;
  loadTagged(): Promise<void>;
};

export type {
  PostSimple,
  PostDetail,
  Reel,
  TaggedPost,
  PostKind,
  PostComment,
} from "@/demo/instagram/api/post";
