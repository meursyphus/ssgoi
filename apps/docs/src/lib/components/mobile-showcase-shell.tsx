"use client";

import type { ReactNode } from "react";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/react";
import { OverlayProvider } from "overlay-kit";
import { Toaster } from "sonner";
import { StateProvider } from "@/lib/state";
import { MobileFrame } from "@/lib/components/mobile-frame";

/**
 * 모바일 쇼케이스용 공통 셸.
 *
 * 모든 쇼케이스 layout/client.tsx는 이걸로 감싸기만 하면 된다.
 * - StateProvider: comwit (router context)
 * - OverlayProvider: overlay-kit (popup.confirm 등)
 * - MobileFrame: 데스크탑에선 가운데 mock device, 모바일에선 풀스크린
 *   (`relative z-0 overflow-x-clip` 적용된 scroll viewport를 가짐 — ssgoi 모바일 가이드 충족)
 * - Ssgoi: 페이지 트랜지션 컨텍스트
 * - Toaster: sonner
 */
export function MobileShowcaseShell({
  config,
  children,
}: {
  config: SsgoiConfig;
  children: ReactNode;
}) {
  return (
    <StateProvider>
      <OverlayProvider>
        <MobileFrame>
          <Ssgoi config={config}>{children}</Ssgoi>
        </MobileFrame>
        <Toaster position="top-center" richColors />
      </OverlayProvider>
    </StateProvider>
  );
}
