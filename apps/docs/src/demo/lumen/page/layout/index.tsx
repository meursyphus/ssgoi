import type { ReactNode } from "react";
import { LumenLayoutClient } from "./client";

export default function LumenLayout({ children }: { children: ReactNode }) {
  return <LumenLayoutClient>{children}</LumenLayoutClient>;
}
