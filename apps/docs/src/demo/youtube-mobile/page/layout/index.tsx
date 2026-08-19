import type { ReactNode } from "react";
import { YouTubeMobileLayoutClient } from "./client";

export default function YouTubeMobileLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <YouTubeMobileLayoutClient>{children}</YouTubeMobileLayoutClient>;
}
