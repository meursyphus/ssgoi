import type { ReactNode } from "react";
import { NoraHaleLayoutClient } from "./client";

export default function NoraHaleLayout({ children }: { children: ReactNode }) {
  return <NoraHaleLayoutClient>{children}</NoraHaleLayoutClient>;
}
