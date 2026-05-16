import type { ReactNode } from "react";
import { GamjaMarketLayoutClient } from "./client";

export default function GamjaMarketLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <GamjaMarketLayoutClient>{children}</GamjaMarketLayoutClient>;
}
