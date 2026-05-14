import Image from "next/image";
import Link from "next/link";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-50 border-b border-white/[0.04] bg-[#0e0b08]/80 backdrop-blur">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-base font-semibold tracking-tight"
          >
            <Image
              src="/ssgoi-logo.png"
              alt=""
              width={28}
              height={28}
              priority
              className="h-7 w-7"
            />
            <span>ssgoi</span>
          </Link>
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
