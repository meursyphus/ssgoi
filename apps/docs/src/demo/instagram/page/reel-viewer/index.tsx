"use client";

import { useEffect } from "react";
import { SsgoiRouteBoundary } from "@ssgoi/react/nextjs";
import { usePost, type ReelDetail } from "@/demo/instagram/state/post";
import { ReelTopBar } from "./top-bar";
import { ReelActionRail } from "./action-rail";
import { ReelCaption } from "./caption";

export default function ReelViewerPage({
  initialData,
}: {
  initialData: ReelDetail;
}) {
  const post = usePost((state) => ({
    actions: state.actions,
  }));
  post.actions.initReel(initialData);
  // 바로 들어왔다가 닫을 때도 릴스 탭 타일(exit key)이 첫 렌더에 있도록 미리 받아 둔다
  useEffect(() => {
    post.actions.loadReels();
  }, [post.actions]);
  const reel = initialData;
  return (
    <SsgoiRouteBoundary className="relative block h-full min-h-full w-full overflow-hidden bg-black text-white">
      <img
        src={reel.image}
        alt=""
        width={400}
        height={700}
        className="absolute inset-0 h-full w-full object-cover"
        data-zoom-enter-key={reel.id}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
      <ReelTopBar
        fallbackHref={`/demo/instagram/profile/${reel.author.username}/reels`}
      />
      <div className="absolute inset-x-0 bottom-0 flex items-end gap-3 pb-safe-6 pl-4 pr-2">
        <ReelCaption reel={reel} />
        <ReelActionRail reel={reel} />
      </div>
    </SsgoiRouteBoundary>
  );
}
