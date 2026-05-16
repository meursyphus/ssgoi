import type { ReactNode } from "react";
import { YuzuClubLayoutClient } from "./client";

export default function YuzuClubLayout({ children }: { children: ReactNode }) {
  return <YuzuClubLayoutClient>{children}</YuzuClubLayoutClient>;
}
