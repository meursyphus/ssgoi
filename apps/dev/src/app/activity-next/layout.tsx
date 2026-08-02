import type { ReactNode } from "react";
import { ActivityNextProvider } from "./activity-next-client";

export default function ActivityNextLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <ActivityNextProvider>{children}</ActivityNextProvider>;
}
