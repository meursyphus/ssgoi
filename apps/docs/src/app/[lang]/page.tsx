import Link from "next/link";
import { ArrowRight, Sparkles, Zap, CheckCircle, Smartphone, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section - 좌우 분할 */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        {/* 배경 그라데이션 효과 */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-0 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-vivid-orange/20 blur-[120px]" />
          <div className="absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-vivid-purple/15 blur-[120px]" />
        </div>
        
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* 왼쪽: 텍스트 */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-vivid-green/30 bg-vivid-green/10 px-4 py-2">
                <CheckCircle className="h-4 w-4 text-vivid-green" />
                <span className="text-sm font-medium text-vivid-green">SSR Ready</span>
              </div>
              
              <h1 className="text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
                <span className="block text-white">View</span>
                <span className="gradient-orange">Transitions</span>
              </h1>
              <p className="mt-6 text-xl text-muted-foreground sm:text-2xl">
                <span className="font-semibold text-white">네이티브 앱 같은 페이지 전환</span>을
                웹에서 구현하세요.
              </p>
              <p className="mt-4 text-lg text-muted-foreground">
                Next.js, Remix, Gatsby 등 모든 SSR 프레임워크와 완벽 호환.
                SEO를 포기하지 않고도 멋진 애니메이션을 만들 수 있습니다.
              </p>
              
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/ko/docs/getting-started/introduction"
                  className="btn-primary text-lg"
                >
                  시작하기
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="https://github.com/meursyphus/ssgoi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-lg"
                >
                  <Code2 className="h-5 w-5" />
                  GitHub
                </a>
              </div>
              
              {/* 빠른 설치 */}
              <div className="mt-12 rounded-lg bg-card/50 p-4">
                <p className="mb-2 text-xs font-medium text-muted-foreground">NPM</p>
                <code className="font-mono text-sm text-white">
                  npm install @meursyphus/ssgoi-react
                </code>
              </div>
            </div>
            
            {/* 오른쪽: 앱 데모 */}
            <div className="relative">
              <div className="relative mx-auto max-w-sm">
                {/* 모바일 프레임 */}
                <div className="relative overflow-hidden rounded-[3rem] border-8 border-white/10 bg-black shadow-2xl">
                  <div className="absolute left-1/2 top-4 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
                  
                  {/* GIF 플레이스홀더 */}
                  <div className="aspect-[9/19.5] bg-gradient-to-br from-card to-muted">
                    <div className="flex h-full items-center justify-center p-8">
                      <div className="text-center">
                        <Smartphone className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                        <p className="text-sm font-medium text-muted-foreground">
                          페이지 전환 애니메이션
                          <br />데모 GIF
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 플로팅 배지 */}
                <div className="absolute -left-4 top-1/4 animate-float rounded-lg bg-vivid-orange px-3 py-2 text-sm font-medium text-white shadow-lg">
                  60fps 유지
                </div>
                <div className="absolute -right-4 bottom-1/4 animate-float rounded-lg bg-vivid-purple px-3 py-2 text-sm font-medium text-white shadow-lg" style={{ animationDelay: "1s" }}>
                  상태 기억
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 프레임워크 지원 섹션 */}
      <section className="border-y border-border bg-card/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              모든 환경에서 <span className="gradient-orange">동일한 경험</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              프레임워크에 관계없이 일관된 API로 사용하세요
            </p>
          </div>
          
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {/* JavaScript */}
            <div className="group flex flex-col items-center gap-3">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-vivid-yellow to-vivid-orange p-4 transition-transform group-hover:scale-110">
                <span className="text-2xl font-black text-white">JS</span>
              </div>
              <span className="text-sm font-medium text-muted-foreground">JavaScript</span>
            </div>
            
            {/* React */}
            <div className="group flex flex-col items-center gap-3">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-vivid-blue to-vivid-cyan p-4 transition-transform group-hover:scale-110">
                <span className="text-2xl font-black text-white">R</span>
              </div>
              <span className="text-sm font-medium text-muted-foreground">React</span>
            </div>
            
            {/* Svelte */}
            <div className="group flex flex-col items-center gap-3">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-vivid-orange to-vivid-red p-4 transition-transform group-hover:scale-110">
                <span className="text-2xl font-black text-white">S</span>
              </div>
              <span className="text-sm font-medium text-muted-foreground">Svelte</span>
            </div>
            
            {/* Vue */}
            <div className="group flex flex-col items-center gap-3">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-vivid-green to-vivid-cyan p-4 transition-transform group-hover:scale-110">
                <span className="text-2xl font-black text-white">V</span>
              </div>
              <span className="text-sm font-medium text-muted-foreground">Vue</span>
            </div>
            
            {/* SolidJS */}
            <div className="group flex flex-col items-center gap-3">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-vivid-purple to-vivid-blue p-4 transition-transform group-hover:scale-110">
                <span className="text-2xl font-black text-white">So</span>
              </div>
              <span className="text-sm font-medium text-muted-foreground">SolidJS</span>
            </div>
            
            {/* Qwik */}
            <div className="group flex flex-col items-center gap-3">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-vivid-pink to-vivid-purple p-4 transition-transform group-hover:scale-110">
                <span className="text-2xl font-black text-white">Q</span>
              </div>
              <span className="text-sm font-medium text-muted-foreground">Qwik</span>
            </div>
          </div>
        </div>
      </section>

      {/* 핵심 기능 3가지 */}
      <section className="px-4 py-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              왜 <span className="gradient-orange">SSGOI</span>인가?
            </h2>
            <p className="mt-6 text-xl text-muted-foreground">
              단 3가지 이유만 기억하세요
            </p>
          </div>
          
          <div className="mt-20 grid gap-8 md:grid-cols-3">
            {/* SSR/SSG 완벽 지원 */}
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-vivid-green">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-vivid-green to-vivid-cyan">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-4 text-2xl font-bold">SSR/SSG 완벽 지원</h3>
              <p className="text-lg text-muted-foreground">
                Next.js, Remix, Gatsby와 같은 SSR 프레임워크에서 완벽하게 작동. 
                SEO를 포기하지 않고도 멋진 페이지 전환을 구현하세요.
              </p>
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-vivid-green/10 blur-2xl" />
            </div>
            
            {/* 상태 기억 애니메이션 */}
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-vivid-orange">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-vivid-orange to-vivid-yellow">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-4 text-2xl font-bold">상태 기억 애니메이션</h3>
              <p className="text-lg text-muted-foreground">
                토글을 아무리 빠르게 클릭해도 끊김이 없습니다. 
                현재 위치와 속도를 기억해 자연스럽게 이어갑니다.
              </p>
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-vivid-orange/10 blur-2xl" />
            </div>
            
            {/* 제로 설정 */}
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-vivid-purple">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-vivid-purple to-vivid-pink">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-4 text-2xl font-bold">제로 설정</h3>
              <p className="text-lg text-muted-foreground">
                복잡한 설정 없이 바로 사용. 
                기본 프리셋만으로도 충분히 아름다운 애니메이션을 만들 수 있습니다.
              </p>
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-vivid-purple/10 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* 간단한 코드 예제 */}
      <section className="border-t border-border bg-card/30 px-4 py-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              놀랍도록 <span className="gradient-orange">간단한 코드</span>
            </h2>
            <p className="mt-6 text-xl text-muted-foreground">
              단 몇 줄로 페이지 전환 애니메이션을 구현하세요
            </p>
          </div>
          
          <div className="mt-16 rounded-2xl border border-border bg-card p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-vivid-red" />
              <div className="h-3 w-3 rounded-full bg-vivid-yellow" />
              <div className="h-3 w-3 rounded-full bg-vivid-green" />
            </div>
            <pre className="overflow-x-auto text-sm">{`import { Ssgoi, SsgoiTransition } from '@meursyphus/ssgoi-react'
import { fade } from '@meursyphus/ssgoi-react/view-transitions'

// 1. 앱을 Ssgoi로 감싸기
function App() {
  return (
    <Ssgoi config={{ defaultTransition: fade() }}>
      <Router />
    </Ssgoi>
  )
}

// 2. 각 페이지에 SsgoiTransition 적용
function HomePage() {
  return (
    <SsgoiTransition id="/home">
      <div>홈 페이지 콘텐츠</div>
    </SsgoiTransition>
  )
}

// 끝! 이제 페이지 전환 시 부드러운 애니메이션이 적용됩니다.`}</pre>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="px-4 py-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-vivid-orange via-vivid-pink to-vivid-purple p-1">
            <div className="rounded-[calc(1.5rem-1px)] bg-background p-12 sm:p-16">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                  지금 바로 시작하세요
                </h2>
                <p className="mt-6 text-xl text-muted-foreground">
                  5분이면 충분합니다. SSGOI로 웹에 네이티브 앱 경험을 더하세요.
                </p>
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link
                    href="/ko/docs/getting-started/installation"
                    className="btn-primary text-lg"
                  >
                    <Zap className="h-5 w-5" />
                    문서 보기
                  </Link>
                  <a
                    href="https://github.com/meursyphus/ssgoi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-lg"
                  >
                    <Code2 className="h-5 w-5" />
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
