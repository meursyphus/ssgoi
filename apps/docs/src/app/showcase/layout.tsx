import type { ReactNode } from "react";
export default function ShowcaseLayout({ children }: { children: ReactNode }) {
  return <div className="relative min-h-dvh bg-black">{children}</div>;
}
