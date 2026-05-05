import Link from "next/link";

const ROUTES: { href: string; title: string; description: string }[] = [
  {
    href: "/g/sheet1",
    title: "/g/sheet1",
    description: "Sheet 트랜지션 — Feed → Compose 플로우 (FAB → 새 글)",
  },
  {
    href: "/animator",
    title: "/animator",
    description: "Animator 테스트용 빈 라우트",
  },
];

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-neutral-950 px-6 py-16 text-neutral-100">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-semibold tracking-tight">ssgoi dev</h1>
        <p className="mt-2 text-sm text-neutral-400">
          모바일 트랜지션 / 애니메이션 테스트 플레이그라운드. 데스크톱에서는
          모바일 목업 안에서 동작합니다.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          {ROUTES.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="group rounded-xl border border-white/10 bg-white/[0.02] px-4 py-4 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-sm font-medium text-blue-400">
                  {route.title}
                </span>
                <span className="text-xs text-neutral-500 group-hover:text-neutral-300">
                  →
                </span>
              </div>
              <p className="mt-1 text-sm text-neutral-300">
                {route.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
