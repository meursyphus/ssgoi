"use client";

import { useEffect } from "react";
import { SsgoiTransition } from "@ssgoi/react";
import { usePost, type PostDetail } from "@/demo/instagram/state/post";
import { useProfile } from "@/demo/instagram/state/profile";
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

  useEffect(() => {
    if (!profile.me.data) profile.actions.loadMe();
  }, [profile.actions, profile.me.data]);

  const detail = post.current ?? initialData;
  const me = profile.me.data;

  return (
    <SsgoiTransition id={`/demo/instagram/feed/${detail.id}`}>
      <div className="flex h-full flex-col bg-white">
        <FeedDetailHeader
          backHref={`/demo/instagram/profile/${me?.username ?? "deaseungseung94"}`}
        />
        <div className="flex-1 overflow-y-auto">
          <FeedDetailImage post={detail} author={me} />
          <FeedDetailActions />
          <FeedDetailMeta post={detail} author={me} />
          <div className="h-6" />
        </div>
      </div>
    </SsgoiTransition>
  );
}
