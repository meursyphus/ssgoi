import { SsgoiLayoutBoundary } from "@ssgoi/react";

export default function DetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Depth 1: detail <-> detail
    <SsgoiLayoutBoundary className="flex-1 bg-[#121212]">
      {children}
    </SsgoiLayoutBoundary>
  );
}
