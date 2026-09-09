import { SsgoiRouteBoundary } from "@ssgoi/react/nextjs";

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SsgoiRouteBoundary className="min-h-full bg-[#121212]">
      {children}
    </SsgoiRouteBoundary>
  );
}
