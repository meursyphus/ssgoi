"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/react";
import { scroll } from "@ssgoi/react/view-transitions";
import { HostAnimation } from "@ssgoi/core/internal";
import { ShowcaseHostBridge } from "@/lib/components/showcase-host-bridge";

const config: SsgoiConfig = {
  preserveScroll: false,
  transitions: [
    scroll({
      paths: ["/", "/showcase"],
      type: "non-directional",
      direction: "up",
    }),
  ],
};

/**
 * docs(landing + /showcase) 전역 SSgoi 프로바이더. 데모 라우트가 아닌 곳에서는
 * 자체 host의 dock을 띄우고, `/demo/*` 라우트에서는 demo의 DemoShell이 자기
 * dock을 띄우므로 여기선 dock을 끈다 (bridge는 항상 켜둬서 iframe 임베딩은 유지).
 *
 * 또한 — 자기 자신을 showcase 데모로도 쓸 수 있도록 (`slug: ssgoi-docs`),
 * iframe 안에서 띄워졌을 때 부모와 postMessage 프로토콜로 통신한다.
 * `ShowcaseHostBridge`가 책임짐.
 */
export function DocsSsgoiProvider({ children }: { children: ReactNode }) {
  const [host] = useState(() => new HostAnimation());
  const pathname = usePathname();
  const showDock = !pathname?.startsWith("/demo/");

  return (
    <>
      <Ssgoi config={config} host={host}>
        {children}
      </Ssgoi>
      <ShowcaseHostBridge host={host} dock={showDock} />
    </>
  );
}
