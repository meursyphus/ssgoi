import { BlogSsgoi } from "@/components/blog/ssgoi";

interface BlogLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function BlogLayout({
  children,
  params,
}: BlogLayoutProps) {
  const { lang } = await params;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 pt-16">
      <div className="relative overflow-hidden z-0">
        <BlogSsgoi>{children}</BlogSsgoi>
      </div>
    </div>
  );
}