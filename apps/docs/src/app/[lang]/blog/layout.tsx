import { SsgoiTransition } from "@ssgoi/react";

interface BlogLayoutProps {
  children: React.ReactNode;
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <SsgoiTransition 
      id="/blog"
      as="div" 
      className="min-h-[calc(100vh-4rem)] bg-zinc-950 pt-16"
    >
      <div className="relative overflow-hidden z-0">
        {children}
      </div>
    </SsgoiTransition>
  );
}
