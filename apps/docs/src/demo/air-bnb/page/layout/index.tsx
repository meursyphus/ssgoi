import type { ReactNode } from "react";
import { AirBnbLayoutClient } from "./client";

export default function AirBnbLayout({ children }: { children: ReactNode }) {
  return <AirBnbLayoutClient>{children}</AirBnbLayoutClient>;
}
