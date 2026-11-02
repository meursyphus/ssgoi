import type { ReactNode } from "react";
import { ComwitLikeShell } from "./shell";

export default function ComwitLikeLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <ComwitLikeShell>{children}</ComwitLikeShell>;
}
