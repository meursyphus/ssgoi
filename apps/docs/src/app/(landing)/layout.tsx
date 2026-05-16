import Link from "next/link";
import { SiteLogo } from "@/components/site-logo";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-50 border-b border-white/[0.04] bg-[#0e0b08]/80 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <SiteLogo />
          <div className="flex items-center gap-6 text-sm text-neutral-400">
            <Link href="/docs" className="hover:text-neutral-100">
              Docs
            </Link>
            <Link href="/showcase" className="hover:text-neutral-100">
              Showcase
            </Link>
            <a
              href="https://github.com/meursyphus/ssgoi"
              target="_blank"
              rel="noreferrer"
              className="hover:text-neutral-100"
            >
              GitHub
            </a>
          </div>
        </nav>
      </header>
      {children}
    </div>
  );
}
