"use client";

import { Link } from "@/lib/link";
import type { PostDetail } from "@/demo/instagram/state/post";
import type { ProfileMe } from "@/demo/instagram/state/profile";
import { CommentList } from "./comment-list";
import { CommentComposer } from "./comment-composer";
import { useCommentDraft } from "./use-comment-draft";

export function FeedDetailMeta({
  post,
  author,
  compact = false,
}: {
  post: PostDetail;
  author: ProfileMe | null;
  /** 홈 피드 카드: 댓글 목록/입력창 없이 캡션과 "모두 보기"만 */
  compact?: boolean;
}) {
  const username =
    post.author?.username ?? author?.username ?? "deaseungseung94";
  const { text, setText, inputRef, replyTo } = useCommentDraft();
  return (
    <div className="text-[13px] text-neutral-900">
      <div className="px-3 pt-2">
        <p className="font-semibold">{post.likesLabel}</p>
        <p className="mt-1 leading-snug">
          {/* 내 게시물만 프로필로 — 친구 프로필 화면은 없다 */}
          {post.author ? (
            <span className="font-semibold">{username}</span>
          ) : (
            <Link
              href={`/demo/instagram/profile/${username}`}
              scroll={false}
              className="font-semibold"
            >
              {username}
            </Link>
          )}{" "}
          <span className="text-neutral-800">{post.caption}</span>
        </p>
        <Link
          href={`/demo/instagram/feed/${post.id}/comments`}
          scroll={false}
          className="mt-1 block text-neutral-500 active:text-neutral-400"
        >
          {post.commentsLabel}
        </Link>
      </div>

      {!compact && (
        <CommentList comments={post.topComments} onReply={replyTo} />
      )}

      <p className="px-3 pt-2 text-[11px] uppercase tracking-wide text-neutral-400">
        {post.publishedAtLabel}
      </p>

      {!compact && (
        <CommentComposer
          avatar={author?.avatar}
          text={text}
          onTextChange={setText}
          inputRef={inputRef}
        />
      )}
    </div>
  );
}
