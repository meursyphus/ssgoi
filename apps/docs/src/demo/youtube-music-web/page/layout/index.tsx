import type { ReactNode } from "react";
import { YoutubeMusicLayoutClient } from "./client";

export default function YoutubeMusicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <YoutubeMusicLayoutClient>{children}</YoutubeMusicLayoutClient>;
}
