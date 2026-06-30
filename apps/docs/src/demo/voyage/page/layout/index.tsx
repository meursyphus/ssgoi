import type { ReactNode } from "react";
import { VoyageLayoutClient } from "./client";

export default function VoyageLayout({ children }: { children: ReactNode }) {
  return <VoyageLayoutClient>{children}</VoyageLayoutClient>;
}
