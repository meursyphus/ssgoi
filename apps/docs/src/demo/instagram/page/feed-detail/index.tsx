"use client";

import { useEffect } from "react";
import { usePost, type PostDetail } from "@/demo/instagram/state/post";
import { useProfile } from "@/demo/instagram/state/profile";
import { SsgoiRouteBoundary } from "@ssgoi/react/nextjs";
import { FeedDetailHeader } from "./header";
import { FeedDetailImage } from "./image";
import { FeedDetailActions } from "./actions";
import { FeedDetailMeta } from "./meta";
export default function FeedDetailPage({
  initialData,
}: {
  initialData: PostDetail;
}) {
  const post = usePost((state) => ({
    current: state.currentPost,
    actions: state.actions,
  }));
  post.actions.init(initialData);
  const profile = useProfile((state) => ({
    me: state.me,
    actions: state.actions,
  }));
  const isTagged = !!initialData.author;
  useEffect(() => {
    if (!profile.me.data) profile.actions.loadMe();
  }, [profile.actions, profile.me.data]);
  // 바로 들어온 뒤 뒤로 갈 때(fallback push) 돌아갈 탭의 타일이 첫 렌더에 있어야
  // zoom이 짝을 찾는다 — 목록을 미리 받아 둔다.
  useEffect(() => {
    if (isTagged) post.actions.loadTagged();
    else post.actions.loadPosts();
  }, [post.actions, isTagged]);
  // 셀렉터 값은 init 이전 스냅샷이라 이전 게시물일 수 있다 — id로 확인
  const detail =
    post.current?.id === initialData.id ? post.current : initialData;
  const me = profile.me.data;
  const profileHref = `/demo/instagram/profile/${me?.username ?? "deaseungseung94"}`;
  return (
    <SsgoiRouteBoundary className="relative block min-h-full w-full bg-white">
      <FeedDetailHeader
        fallbackHref={isTagged ? `${profileHref}/tagged` : profileHref}
      />
      <FeedDetailImage post={detail} author={me} />
      <FeedDetailActions postId={detail.id} />
      <FeedDetailMeta post={detail} author={me} />
    </SsgoiRouteBoundary>
  );
}
