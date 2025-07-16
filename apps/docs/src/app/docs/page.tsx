import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function DocsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">문서</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          SSGOI를 사용하여 웹 애플리케이션에 멋진 애니메이션을 추가하는 방법을 알아보세요.
        </p>
      </div>
      
      <div className="grid gap-6">
        <Link
          href="/docs/getting-started/introduction"
          className="group glow-card p-6 transition-all hover:scale-[1.02]"
        >
          <h2 className="mb-2 text-xl font-semibold group-hover:text-primary">
            시작하기
          </h2>
          <p className="mb-4 text-muted-foreground">
            SSGOI의 기본 개념과 설치 방법을 알아보고 첫 번째 애니메이션을 만들어보세요.
          </p>
          <span className="inline-flex items-center text-sm font-medium text-primary">
            자세히 보기
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
        
        <Link
          href="/docs/core-concepts/dom-lifecycle"
          className="group glow-card p-6 transition-all hover:scale-[1.02]"
        >
          <h2 className="mb-2 text-xl font-semibold group-hover:text-primary">
            핵심 개념
          </h2>
          <p className="mb-4 text-muted-foreground">
            DOM 생명주기와 애니메이션의 관계, Transition API의 상세한 동작 방식을 이해합니다.
          </p>
          <span className="inline-flex items-center text-sm font-medium text-primary">
            자세히 보기
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
        
        <Link
          href="/docs/api/core-package"
          className="group glow-card p-6 transition-all hover:scale-[1.02]"
        >
          <h2 className="mb-2 text-xl font-semibold group-hover:text-primary">
            API 레퍼런스
          </h2>
          <p className="mb-4 text-muted-foreground">
            SSGOI의 모든 API와 옵션에 대한 상세한 설명과 예제를 확인하세요.
          </p>
          <span className="inline-flex items-center text-sm font-medium text-primary">
            자세히 보기
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </div>
    </div>
  )
}