import type { ReactNode } from "react";
import { SsgoiTransition } from "@ssgoi/react";

export default function ShowcaseLayout({ children }: { children: ReactNode }) {
  return (
    <SsgoiTransition id="/showcase" className="relative min-h-dvh bg-black">
      {children}
    </SsgoiTransition>
  );
}
