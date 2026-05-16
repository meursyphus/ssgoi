import type { ReactNode } from "react";
import { SilentRoomLayoutClient } from "./client";

export default function SilentRoomLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <SilentRoomLayoutClient>{children}</SilentRoomLayoutClient>;
}
