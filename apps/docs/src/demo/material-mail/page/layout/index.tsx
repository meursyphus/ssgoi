import type { ReactNode } from "react";
import { MaterialMailLayoutClient } from "./client";

export default function MaterialMailLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <MaterialMailLayoutClient>{children}</MaterialMailLayoutClient>;
}
