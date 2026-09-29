"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useProfile } from "@/demo/instagram/state/profile";
import { ProfileHeader } from "../profile-shell/header";
import { ProfileHeaderSkeleton } from "../profile-shell/header-skeleton";
import { ProfileTabs } from "../profile-shell/tabs";
import { ProfileTopBar } from "../profile-shell/top-bar";
import { ProfileBottomBar } from "../profile-shell/bottom-bar";

/**
 * 프로필 레이아웃 — 바깥 boundary(/profile/:id, 탭과 무관하게 유지)와 탭 내용만
 * 바뀌는 안쪽 boundary.
 *
 * 둘 다 `SsgoiRouteBoundary`가 아니라 `key` + `data-ssgoi-transition`을 단
 * 평범한 요소다. `SsgoiRouteBoundary`는 스스로 `<Suspense>`로 감싸서, 탭 페이지
 * 청크가 아직 없을 때(게시물·릴스로 바로 들어왔다가 뒤로) 레이아웃이 빈 채로
 * 먼저 커밋되고 SSGOI가 타일 없이 짝을 지어 zoom 없이 끊겼다. Suspense가 없으면
 * 대기가 데모 레이아웃의 이미 보이는 `<Suspense>`까지 올라가, 떠나는 화면을
 * 유지한 채 레이아웃과 탭 내용을 함께 커밋한다 (MobileTabsShell과 같은 방식).
 */
export function InstagramProfileLayoutClient({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const base = `/demo/instagram/profile/${id}`;
  const pathname = usePathname();
  const profile = useProfile((state) => ({
    me: state.me,
    actions: state.actions,
  }));
  useEffect(() => {
    profile.actions.loadMe();
  }, [profile.actions]);
  const me = profile.me.data;
  return (
    <div
      data-ssgoi-transition={base}
      className="relative block min-h-full w-full bg-white text-neutral-900"
    >
      <div className="sticky top-0 z-30 bg-white">
        <ProfileTopBar
          username={me?.username ?? id}
          isPrivate={me?.isPrivate ?? true}
        />
      </div>
      {me ? <ProfileHeader me={me} /> : <ProfileHeaderSkeleton />}
      <ProfileTabs id={id} />
      <div className="relative z-0 bg-white">
        {/* 그리드 탭의 논리 id는 바깥 boundary(/profile/:id)와 달라야 한다. 같으면
            다른 탭으로 레이아웃에 들어온 직후(태그된 게시물·릴스에서 뒤로)
            그리드 탭을 누를 때, 안쪽 IN이 방금 들어온 바깥 boundary의 중복
            arrival로 흡수돼 slide 없이 끊긴다. (반대 방향 — 탭 전환 직후
            레이아웃을 떠날 때 바깥 OUT이 흡수되던 것은 코어가 고쳤다.) */}
        <div
          key={pathname}
          data-ssgoi-transition={pathname === base ? `${base}/posts` : pathname}
          className="min-h-full bg-white"
        >
          {children}
        </div>
      </div>
      <div className="sticky bottom-0 z-30 bg-white">
        <ProfileBottomBar avatar={me?.avatar} profileHref={base} />
      </div>
    </div>
  );
}
