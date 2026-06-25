"use client";

import { type ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { OverlayProvider } from "overlay-kit";
import { Toaster } from "sonner";
import { StateProvider } from "@/lib/state";
import { MobileFrame } from "@/lib/components/mobile-frame";
import { DemoShell, SsgoiWithHost } from "@/lib/components/demo-shell";
import { cn } from "@/lib/utils";

/**
 * 모바일 쇼케이스용 셸. host/bridge/dock은 위쪽(`DocsSsgoiProvider` + `/demo/layout.tsx`)
 * 에서 한 번씩 마운트되므로 여기서는 모바일 프레임 + state/overlay providers + Ssgoi
 * (호스트 자동 바인딩)만 책임진다.
 */
export function MobileShowcaseShell({
  config,
  children,
  contentClassName,
  bottomSlot,
  withTransitionBoundary = true,
}: {
  config: SsgoiConfig;
  children: ReactNode;
  /**
   * 컨텐츠(스크롤) 영역에 덧붙일 className. 기본은 투명(프레임의 검정이 비침).
   * 예: `bg-white` — kakao-talk처럼 흰 바탕이 필요한 쇼케이스.
   */
  contentClassName?: string;
  /**
   * 콘텐츠 영역 바깥에 고정으로 붙는 슬롯. 보통 bottom nav/tab bar처럼
   * page transition 영향을 받지 말아야 하는 요소를 넣는다.
   */
  bottomSlot?: ReactNode;
  /**
   * Most mobile demos can use the shared pathname boundary. Nested demos can
   * opt out and place their boundary on the exact routed shell instead.
   */
  withTransitionBoundary?: boolean;
}) {
  return (
    <DemoShell>
      <StateProvider>
        <OverlayProvider>
          <MobileFrame
            contentClassName={contentClassName}
            bottomSlot={bottomSlot}
          >
            <SsgoiWithHost
              config={config}
              withTransitionBoundary={withTransitionBoundary}
              boundaryClassName={cn(
                "h-full min-h-full bg-black",
                contentClassName,
              )}
            >
              {children}
            </SsgoiWithHost>
          </MobileFrame>
          <Toaster position="top-center" richColors />
        </OverlayProvider>
      </StateProvider>
    </DemoShell>
  );
}
