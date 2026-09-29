import type { ReactNode } from "react";
import { MobileDetailShell } from "@/lib/components/mobile-detail-shell";

export default function DetailLayout({ children }: { children: ReactNode }) {
  return (
    <MobileDetailShell className="bg-[#FAF8F6]">{children}</MobileDetailShell>
  );
}
