import type { ReactNode } from "react";
import { MobileDetailShell } from "@/lib/components/mobile-detail-shell";

export default function DetailLayout({ children }: { children: ReactNode }) {
  return <MobileDetailShell className="bg-black">{children}</MobileDetailShell>;
}
