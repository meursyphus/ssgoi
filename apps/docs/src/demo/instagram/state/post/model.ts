import { model, query, keepPreviousData } from "comwit";
import { post as postAPI } from "@/demo/instagram/api/post";
import type { PostState } from "./types";

export const post = model<PostState>({
  posts: query<PostState["posts"]["data"], void>({
    initialData: [],
    queryFn: () => postAPI.findAll(),
    placeholderData: keepPreviousData,
  }),
  reels: query<PostState["reels"]["data"], void>({
    initialData: [],
    queryFn: () => postAPI.findReels(),
    placeholderData: keepPreviousData,
  }),
  tagged: query<PostState["tagged"]["data"], void>({
    initialData: [],
    queryFn: () => postAPI.findTagged(),
    placeholderData: keepPreviousData,
  }),
  explore: query<PostState["explore"]["data"], void>({
    initialData: [],
    queryFn: () => postAPI.findExplore(),
    placeholderData: keepPreviousData,
  }),
  feed: query<PostState["feed"]["data"], void>({
    initialData: [],
    queryFn: () => postAPI.findFeed(),
    placeholderData: keepPreviousData,
  }),
  currentPost: null,
  currentReel: null,
});
