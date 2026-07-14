import type { ReactNode } from "react";
import { PinterestDetailShell } from "./client";

export default function DetailShell({ children }: { children: ReactNode }) {
  return <PinterestDetailShell>{children}</PinterestDetailShell>;
}
