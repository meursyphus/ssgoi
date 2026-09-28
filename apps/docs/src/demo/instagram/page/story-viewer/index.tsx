"use client";

import { useEffect, useState } from "react";
import { SsgoiRouteBoundary } from "@ssgoi/react/nextjs";
import { useProfile, type StoryDetail } from "@/demo/instagram/state/profile";
import { useDemoBack } from "@/lib/hooks";
import { StoryProgress } from "./progress";
import { StoryHeader } from "./header";
import { StoryReplyBar } from "./reply-bar";

export default function StoryViewerPage({
  initialData,
}: {
  initialData: StoryDetail;
}) {
  const profile = useProfile((state) => ({
    me: state.me,
    actions: state.actions,
  }));
  profile.actions.initStory(initialData);
  // 바로 들어왔다가 닫을 때도 돌아갈 화면의 원(exit key)이 첫 렌더에 있도록
  useEffect(() => {
    profile.actions.loadMe();
    profile.actions.loadStoryTray();
  }, [profile.actions]);

  const story = initialData;
  const [index, setIndex] = useState(0);
  const [run, setRun] = useState(0);
  const username = profile.me.data?.username ?? "deaseungseung94";
  // X(링크)와 마지막 장 오른쪽 탭(버튼) 모두 온 곳으로 — 바로 들어왔으면 원이 있는 화면으로
  const closeHref = story.isMine
    ? `/demo/instagram/profile/${username}`
    : "/demo/instagram/home";
  const close = useDemoBack(closeHref);
  const frame = story.frames[index];
  const last = index === story.frames.length - 1;

  const next = () => (last ? close() : setIndex(index + 1));
  const prev = () => (index === 0 ? setRun(run + 1) : setIndex(index - 1));

  return (
    <SsgoiRouteBoundary className="relative block h-full min-h-full w-full overflow-hidden bg-black text-white">
      <div className="absolute inset-x-0 top-0 bottom-safe-16 overflow-hidden rounded-[14px] bg-neutral-900">
        {/* enter key는 지금 보이는 한 장에만 — 닫으면 누른 원으로 접힌다 */}
        <img
          key={frame.id}
          src={frame.image}
          alt=""
          width={400}
          height={700}
          className="h-full w-full object-cover"
          data-zoom-enter-key={story.id}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/45 to-transparent" />
        <button
          type="button"
          aria-label="이전 스토리"
          onClick={prev}
          className="absolute bottom-0 left-0 top-20 w-[30%]"
        />
        <button
          type="button"
          aria-label="다음 스토리"
          onClick={next}
          className="absolute bottom-0 right-0 top-20 w-[70%]"
        />
        <div className="absolute inset-x-0 top-0 px-2 pt-2">
          <StoryProgress
            count={story.frames.length}
            index={index}
            runKey={`${index}-${run}`}
            onComplete={() => {
              if (!last) setIndex(index + 1);
            }}
          />
          <StoryHeader story={story} closeHref={closeHref} />
        </div>
      </div>
      <StoryReplyBar story={story} />
    </SsgoiRouteBoundary>
  );
}
