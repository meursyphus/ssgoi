"use client";

import type { ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { drill, fade, sheet, slide, zoom } from "@ssgoi/react/view-transitions";
import { MobileShowcaseShell } from "@/lib/components/mobile-showcase-shell";

const BASE = "/demo/instagram";
// profile/[id] 레이아웃의 바깥 boundary id는 탭과 무관하게 /profile/:id 로 고정
const PROFILE = `${BASE}/profile/*`;
// 바텀 네비로 오가는 최상위 화면들
const ROOTS = [PROFILE, `${BASE}/home`, `${BASE}/explore`];

const config: SsgoiConfig = {
  transitions: [
    // 그리드·태그됨·탐색 타일 → 게시물: zoom static
    {
      from: [PROFILE, `${BASE}/explore`],
      to: `${BASE}/feed/*`,
      transition: zoom({ type: "static" }),
    },
    // 프로필 탭 사이 — 안쪽 boundary만 slide (그리드 탭의 논리 id는 /posts)
    {
      ordered: [
        `${BASE}/profile/:id/posts`,
        `${BASE}/profile/:id/reels`,
        `${BASE}/profile/:id/remix`,
        `${BASE}/profile/:id/tagged`,
      ],
      transition: slide(),
    },
    // 릴스 타일 → 전체 화면 릴스: 타일이 화면 가득 펼쳐진다
    {
      from: PROFILE,
      to: `${BASE}/reels/*`,
      transition: zoom({ type: "expand" }),
    },
    // 홈·탐색에서 바텀 네비 릴스: 타일이 없으니 탭 전환처럼 fade
    {
      from: [`${BASE}/home`, `${BASE}/explore`],
      to: `${BASE}/reels/*`,
      transition: fade(),
    },
    // 스토리 링·하이라이트 원 → 스토리 뷰어
    {
      from: [PROFILE, `${BASE}/home`, `${BASE}/feed/*`],
      to: `${BASE}/stories/*`,
      transition: zoom({ type: "expand" }),
    },
    // 새 게시물 · 댓글: 아래에서 올라오는 시트
    { on: `${BASE}/create`, transition: sheet() },
    { on: `${BASE}/feed/*/comments`, transition: sheet() },
    // 팔로워/팔로잉 목록: 내비게이션 push
    { on: `${BASE}/follows/*`, transition: drill() },
    // 바텀 네비 탭 전환 — 방향 없는 fade, 양쪽 스크롤 유지
    {
      from: ROOTS,
      to: ROOTS,
      preserveScroll: { from: true, to: true },
      transition: fade(),
    },
  ],
};

export function InstagramLayoutClient({ children }: { children: ReactNode }) {
  return (
    <MobileShowcaseShell config={config} withTransitionBoundary={false}>
      {children}
    </MobileShowcaseShell>
  );
}
