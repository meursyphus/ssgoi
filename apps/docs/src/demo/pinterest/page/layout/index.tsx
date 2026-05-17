import type { ReactNode } from "react";
import { PinterestLayoutClient } from "./client";

export default function PinterestLayout({ children }: { children: ReactNode }) {
  return <PinterestLayoutClient>{children}</PinterestLayoutClient>;
}
