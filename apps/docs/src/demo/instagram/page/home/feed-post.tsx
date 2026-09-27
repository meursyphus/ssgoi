"use client";

import type { PostDetail } from "@/demo/instagram/state/post";
import type { ProfileMe } from "@/demo/instagram/state/profile";
import { FeedDetailImage } from "../feed-detail/image";
import { FeedDetailActions } from "../feed-detail/actions";
import { FeedDetailMeta } from "../feed-detail/meta";

/** 홈 피드 카드 — 단일 게시물 화면과 같은 섹션을 재사용 */
export function HomeFeedPost({
  post,
  me,
}: {
  post: PostDetail;
  me: ProfileMe | null;
}) {
  return (
    <article className="pb-4 pt-1">
      <FeedDetailImage post={post} author={me} variant="feed" />
      <FeedDetailActions postId={post.id} />
      <FeedDetailMeta post={post} author={me} compact />
    </article>
  );
}
