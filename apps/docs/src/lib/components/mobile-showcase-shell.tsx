"use client";

import { type ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { OverlayProvider } from "overlay-kit";
import { Toaster } from "sonner";
import { StateProvider } from "@/lib/state";
import { MobileFrame } from "@/lib/components/mobile-frame";
import { DemoShell, SsgoiWithHost } from "@/lib/components/demo-shell";

/**
 * 모바일 쇼케이스용 셸. 내부적으로 `<DemoShell>`을 써서 host/bridge/도크가
 * 자동으로 연결되므로, 각 데모 layout은 이걸 감싸기만 하면 된다.
 *
 * iframe-embedded 데모에서 부모(showcase 상세)와 주고받는 postMessage 프로토콜은
 * `ShowcaseHostBridge`가 책임진다 (DemoShell이 내부에서 마운트).
 */
export function MobileShowcaseShell({
  config,
  children,
  contentClassName,
  bottomSlot,
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
}) {
  return (
    <DemoShell>
      <StateProvider>
        <OverlayProvider>
          <MobileFrame
            contentClassName={contentClassName}
            bottomSlot={bottomSlot}
          >
            <SsgoiWithHost config={config}>{children}</SsgoiWithHost>
          </MobileFrame>
          <Toaster position="top-center" richColors />
        </OverlayProvider>
      </StateProvider>
    </DemoShell>
  );
}
