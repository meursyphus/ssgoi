import type { ReactNode } from "react";
import { InstagramLayoutClient } from "./client";

export default function InstagramLayout({ children }: { children: ReactNode }) {
  return <InstagramLayoutClient>{children}</InstagramLayoutClient>;
}
