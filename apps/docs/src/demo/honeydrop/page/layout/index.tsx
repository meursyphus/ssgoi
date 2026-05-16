import type { ReactNode } from "react";
import { HoneydropLayoutClient } from "./client";

export default function HoneydropLayout({ children }: { children: ReactNode }) {
  return <HoneydropLayoutClient>{children}</HoneydropLayoutClient>;
}
