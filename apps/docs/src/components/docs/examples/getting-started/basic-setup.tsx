'use client';

import { Tabs, TabPanel } from '@/components/docs/mdx-components/tabs';

export function BasicSetup() {
  const reactLayout = `// app/layout.tsx
import { Ssgoi } from "@ssgoi/react";
import { fade } from "@ssgoi/react/view-transitions";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <Ssgoi config={{ defaultTransition: fade() }}>
          {/* ⚠️ 중요: position: relative 필수! */}
          <div style={{ position: "relative", minHeight: "100vh" }}>
            {children}
          </div>
        </Ssgoi>
      </body>
    </html>
  );
}`;

  const reactPages = `// app/page.tsx
import { SsgoiTransition } from "@ssgoi/react";

export default function HomePage() {
  return (
    <SsgoiTransition id="/">
      <main>
        <h1>홈 페이지</h1>
        {/* 페이지 내용 */}
      </main>
    </SsgoiTransition>
  );
}

// app/about/page.tsx
export default function AboutPage() {
  return (
    <SsgoiTransition id="/about">
      <main>
        <h1>소개 페이지</h1>
        {/* 페이지 내용 */}
      </main>
    </SsgoiTransition>
  );
}`;

  const svelteLayout = `<!-- src/routes/+layout.svelte -->
<script>
  import { Ssgoi } from "@ssgoi/svelte";
  import { fade } from "@ssgoi/svelte/view-transitions";
</script>

<Ssgoi config={{ defaultTransition: fade() }}>
  <!-- ⚠️ 중요: position: relative 필수! -->
  <div style="position: relative; min-height: 100vh;">
    <slot />
  </div>
</Ssgoi>`;

  const sveltePages = `<!-- src/routes/+page.svelte -->
<script>
  import { SsgoiTransition } from "@ssgoi/svelte";
</script>

<SsgoiTransition id="/">
  <main>
    <h1>홈 페이지</h1>
    <!-- 페이지 내용 -->
  </main>
</SsgoiTransition>

<!-- src/routes/about/+page.svelte -->
<script>
  import { SsgoiTransition } from "@ssgoi/svelte";
</script>

<SsgoiTransition id="/about">
  <main>
    <h1>소개 페이지</h1>
    <!-- 페이지 내용 -->
  </main>
</SsgoiTransition>`;

  return (
    <Tabs items={[{ label: "React", value: "react" }, { label: "Svelte", value: "svelte" }]}>
      <TabPanel value="react">
        <h3>1. 루트 레이아웃 설정 (Next.js App Router)</h3>
        {`\`\`\`tsx\n${reactLayout}\n\`\`\``}
        
        <blockquote>
          <p><strong>왜 position: relative가 필요한가요?</strong></p>
          <p>페이지가 out 애니메이션될 때 `position: absolute`가 적용됩니다. 상위 요소에 `position: relative`가 없으면 페이지가 잘못된 위치로 이동할 수 있습니다.</p>
        </blockquote>
        
        <h3>2. 페이지 래핑</h3>
        {`\`\`\`tsx\n${reactPages}\n\`\`\``}
      </TabPanel>
      
      <TabPanel value="svelte">
        <h3>1. 루트 레이아웃 설정 (SvelteKit)</h3>
        {`\`\`\`svelte\n${svelteLayout}\n\`\`\``}
        
        <blockquote>
          <p><strong>왜 position: relative가 필요한가요?</strong></p>
          <p>페이지가 out 애니메이션될 때 `position: absolute`가 적용됩니다. 상위 요소에 `position: relative`가 없으면 페이지가 잘못된 위치로 이동할 수 있습니다.</p>
        </blockquote>
        
        <h3>2. 페이지 래핑</h3>
        {`\`\`\`svelte\n${sveltePages}\n\`\`\``}
      </TabPanel>
    </Tabs>
  );
}