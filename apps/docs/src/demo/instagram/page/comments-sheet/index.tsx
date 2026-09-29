"use client";

import { useEffect } from "react";
import { SsgoiRouteBoundary } from "@ssgoi/react/nextjs";
import {
  usePost,
  type PostComment,
  type PostDetail,
} from "@/demo/instagram/state/post";
import { useProfile } from "@/demo/instagram/state/profile";
import { CommentList } from "../feed-detail/comment-list";
import { CommentComposer } from "../feed-detail/comment-composer";
import { useCommentDraft } from "../feed-detail/use-comment-draft";
import { CommentsSheetHeader } from "./header";
import { CaptionRow } from "./caption-row";

export default function CommentsSheetPage({
  initialData,
  comments,
}: {
  initialData: PostDetail;
  /** 시트는 상세의 인기 댓글이 아니라 전체 댓글을 보여준다 */
  comments: PostComment[];
}) {
  const post = usePost((state) => ({
    actions: state.actions,
  }));
  post.actions.init(initialData);
  const profile = useProfile((state) => ({
    me: state.me,
    actions: state.actions,
  }));
  useEffect(() => {
    if (!profile.me.data) profile.actions.loadMe();
  }, [profile.actions, profile.me.data]);
  const me = profile.me.data;
  const { text, setText, inputRef, replyTo } = useCommentDraft();
  return (
    <SsgoiRouteBoundary className="relative flex min-h-full w-full flex-col bg-white text-[13px] text-neutral-900">
      <CommentsSheetHeader
        fallbackHref={`/demo/instagram/feed/${initialData.id}`}
      />
      <div className="flex-1 pb-4">
        <CaptionRow post={initialData} me={me} />
        <CommentList comments={comments} onReply={replyTo} />
      </div>
      <CommentComposer
        avatar={me?.avatar}
        text={text}
        onTextChange={setText}
        inputRef={inputRef}
        className="sticky bottom-0 z-10 mt-0"
      />
    </SsgoiRouteBoundary>
  );
}
