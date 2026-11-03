import type { ReactNode } from "react";
import { SsgoiPageBoundary } from "@ssgoi/react";

/** Detail group boundary, like Comwit's (detail) AppGroupLayout. */
export default function DetailLayout({ children }: { children: ReactNode }) {
  return <SsgoiPageBoundary data-group="detail">{children}</SsgoiPageBoundary>;
}
