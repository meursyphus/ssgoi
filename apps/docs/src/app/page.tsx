import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Layers, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-vivid-blue/10 via-vivid-purple/10 to-vivid-pink/10" />
          <div className="absolute left-1/2 top-0 -translate-x-1/2 blur-3xl">
            <div className="h-[30rem] w-[50rem] bg-gradient-to-r from-vivid-blue via-vivid-purple to-vivid-pink opacity-20" />
          </div>
        </div>
        
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
              <span className="gradient-text">SSGOI</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              차세대 웹 애니메이션 프레임워크. DOM 생명주기와 완벽하게 통합되어
              부드럽고 자연스러운 페이지 전환과 요소 애니메이션을 구현합니다.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/docs"
                className={cn(
                  "group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3",
                  "text-sm font-semibold text-primary-foreground",
                  "transition-all hover:bg-primary/90",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
              >
                시작하기
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/examples"
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3",
                  "text-sm font-semibold",
                  "transition-colors hover:bg-accent hover:text-accent-foreground",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
              >
                예제 보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              강력한 기능들
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              SSGOI는 현대적인 웹 애플리케이션을 위한 완벽한 애니메이션 솔루션입니다
            </p>
          </div>
          
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="glow-card p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">DOM 생명주기 통합</h3>
              <p className="text-sm text-muted-foreground">
                React, Vue, Svelte 등 모든 프레임워크와 완벽하게 호환
              </p>
            </div>
            
            <div className="glow-card p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                <Zap className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="mb-2 font-semibold">빠른 성능</h3>
              <p className="text-sm text-muted-foreground">
                최적화된 애니메이션 엔진으로 60fps 유지
              </p>
            </div>
            
            <div className="glow-card p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Layers className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 font-semibold">유연한 API</h3>
              <p className="text-sm text-muted-foreground">
                직관적이고 강력한 API로 복잡한 애니메이션도 쉽게
              </p>
            </div>
            
            <div className="glow-card p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-vivid-green/10">
                <GitBranch className="h-6 w-6 text-vivid-green" />
              </div>
              <h3 className="mb-2 font-semibold">트랜지션 프리셋</h3>
              <p className="text-sm text-muted-foreground">
                다양한 내장 트랜지션으로 빠른 구현 가능
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              간단한 사용법
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              몇 줄의 코드로 멋진 애니메이션을 구현하세요
            </p>
          </div>
          
          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            <div className="code-block">
              <div className="mb-4 text-sm text-muted-foreground">개별 요소 애니메이션</div>
              <pre className="text-sm">
{`import { transition } from '@ssgoi/core'

transition(element, {
  from: { opacity: 0, y: 20 },
  to: { opacity: 1, y: 0 },
  duration: 500,
  easing: 'ease-out'
})`}
              </pre>
            </div>
            
            <div className="code-block">
              <div className="mb-4 text-sm text-muted-foreground">페이지 전환</div>
              <pre className="text-sm">
{`import { SsgoiProvider } from '@ssgoi/react'

<SsgoiProvider
  transition={{
    duration: 600,
    preset: 'fade-slide'
  }}
>
  <App />
</SsgoiProvider>`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-vivid-blue via-vivid-purple to-vivid-pink p-1">
            <div className="rounded-xl bg-background p-8 sm:p-12">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  지금 시작하세요
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  SSGOI와 함께 웹 애플리케이션에 생동감을 불어넣으세요
                </p>
                <div className="mt-8">
                  <Link
                    href="/docs/getting-started/installation"
                    className={cn(
                      "inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4",
                      "text-base font-semibold text-primary-foreground",
                      "transition-all hover:bg-primary/90",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    )}
                  >
                    설치 가이드 보기
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
