export default function IntroductionPage() {
  return (
    <article className="prose prose-invert max-w-none">
      <h1>SSGOI란?</h1>
      
      <p className="lead">
        SSGOI는 현대적인 웹 애플리케이션을 위한 차세대 애니메이션 프레임워크입니다.
        DOM 생명주기와 완벽하게 통합되어 부드럽고 자연스러운 애니메이션을 구현할 수 있습니다.
      </p>
      
      <h2>주요 특징</h2>
      
      <h3>🚀 프레임워크 독립적</h3>
      <p>
        React, Vue, Svelte, Angular 등 어떤 프레임워크와도 함께 사용할 수 있습니다.
        바닐라 JavaScript에서도 완벽하게 동작합니다.
      </p>
      
      <h3>⚡ 뛰어난 성능</h3>
      <p>
        최적화된 애니메이션 엔진으로 60fps를 유지하며, 
        requestAnimationFrame과 Web Animations API를 활용하여 브라우저 성능을 최대한 활용합니다.
      </p>
      
      <h3>🎨 직관적인 API</h3>
      <p>
        간단하고 이해하기 쉬운 API로 복잡한 애니메이션도 쉽게 구현할 수 있습니다.
        TypeScript 완벽 지원으로 개발 경험을 향상시킵니다.
      </p>
      
      <h3>📦 작은 번들 크기</h3>
      <p>
        코어 라이브러리는 단 5KB(gzip)로 매우 가볍습니다.
        필요한 기능만 선택적으로 가져와 사용할 수 있습니다.
      </p>
      
      <h2>언제 SSGOI를 사용하나요?</h2>
      
      <ul>
        <li>페이지 간 부드러운 전환 효과가 필요할 때</li>
        <li>요소의 등장/퇴장 애니메이션을 구현할 때</li>
        <li>복잡한 시퀀스 애니메이션을 만들 때</li>
        <li>성능이 중요한 애니메이션을 구현할 때</li>
      </ul>
      
      <h2>다음 단계</h2>
      <p>
        SSGOI를 시작할 준비가 되셨나요? <a href="/docs/getting-started/installation">설치 가이드</a>를 
        확인하여 프로젝트에 SSGOI를 추가해보세요.
      </p>
    </article>
  )
}