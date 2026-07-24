import { SsgoiRouteBoundary } from "@/components/ssgoi-route-boundary";

export default function PinterestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SsgoiRouteBoundary name="page" className="min-h-full bg-[#121212]">
      {children}
    </SsgoiRouteBoundary>
  );
}
