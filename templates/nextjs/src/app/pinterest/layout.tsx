import { SsgoiLayoutBoundary } from "@ssgoi/react";

export default function PinterestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SsgoiLayoutBoundary className="min-h-full bg-[#121212]">
      {children}
    </SsgoiLayoutBoundary>
  );
}
