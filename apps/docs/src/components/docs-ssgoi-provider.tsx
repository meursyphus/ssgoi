"use client";

import { useState, type ReactNode } from "react";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/react";
import { scroll } from "@ssgoi/react/view-transitions";
import { HostAnimation } from "@ssgoi/core/internal";
import { useShowcaseFrameBridge } from "@/lib/hooks";

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
 * docs(landing + /showcase) 전역 SSgoi 프로바이더.
 *
 * 또한 — 자기 자신을 showcase 데모로도 쓸 수 있도록(`slug: ssgoi-docs`),
 * iframe 안에서 띄워졌을 때 부모(showcase 상세)와 postMessage 프로토콜로
 * 통신한다. MobileShowcaseShell과 동일한 인터페이스:
 *
 *   부모 → docs:
 *     { type: "ssgoi-showcase:navigate", path }
 *     { type: "ssgoi-showcase:host", command, payload? }
 *
 *   docs → 부모:
 *     { type: "ssgoi-showcase:status", status }
 *     { type: "ssgoi-showcase:ready", path }
 *
 * iframe 밖에서는 부모로 상태/ready 메시지를 보내지 않는다.
 */
export function DocsSsgoiProvider({ children }: { children: ReactNode }) {
  const [host] = useState(() => new HostAnimation());
  useShowcaseFrameBridge(host);

  return (
    <Ssgoi config={config} host={host}>
      {children}
    </Ssgoi>
  );
}
