"use client";

import { useState, type ReactNode } from "react";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/react";
import { HostAnimation } from "@ssgoi/core/internal";
import { OverlayProvider } from "overlay-kit";
import { Toaster } from "sonner";
import { useShowcaseFrameBridge } from "@/lib/hooks";
import { StateProvider } from "@/lib/state";
import { MobileFrame } from "@/lib/components/mobile-frame";

/**
 * 모바일 쇼케이스용 공통 셸.
 *
 * 모든 쇼케이스 layout/client.tsx는 이걸로 감싸기만 하면 된다.
 *
 * 추가로 — 이 셸이 iframe 안에서 띄워질 때 외부 부모 페이지(showcase 상세)와
 * postMessage 프로토콜로 통신한다:
 *
 *   부모 → demo (postMessage 수신):
 *     { type: "ssgoi-showcase:navigate", path }
 *       → next/navigation router.push(path, { scroll: false })
 *     { type: "ssgoi-showcase:host", command, payload? }
 *       command: "play" | "pause" | "reverse" | "complete" | "rate"(payload:number)
 *
 *   demo → 부모 (window.parent.postMessage):
 *     { type: "ssgoi-showcase:status", status }
 *       status: "idle" | "playing" | "reversing" | "paused" | "settled"
 *
 * 같은 origin(=docs 단일 앱)에서 iframe을 띄울 거라 origin 체크 없이도 안전하다.
 */
export function MobileShowcaseShell({
  config,
  children,
  contentClassName,
}: {
  config: SsgoiConfig;
  children: ReactNode;
  /**
   * 컨텐츠(스크롤) 영역에 덧붙일 className. 기본은 투명(프레임의 검정이 비침).
   * 예: `bg-white` — kakao-talk처럼 흰 바탕이 필요한 쇼케이스.
   */
  contentClassName?: string;
}) {
  const [host] = useState(() => new HostAnimation());
  useShowcaseFrameBridge(host);

  return (
    <StateProvider>
      <OverlayProvider>
        <MobileFrame contentClassName={contentClassName}>
          <Ssgoi config={config} host={host}>
            {children}
          </Ssgoi>
        </MobileFrame>
        <Toaster position="top-center" richColors />
      </OverlayProvider>
    </StateProvider>
  );
}
