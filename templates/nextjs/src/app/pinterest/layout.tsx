import { SsgoiTransitionBoundary } from "@/components/ssgoi-transition-boundary";

export default function PinterestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SsgoiTransitionBoundary className="min-h-full bg-[#121212]">
      {children}
    </SsgoiTransitionBoundary>
  );
}
