import { MdxRemote } from "@/components/mdx/mdx-remote";

const codeExample = `
\`\`\`tsx
// app/layout.tsx
import { Ssgoi, SsgoiConfig } from '@ssgoi/react'
import { fade, hero } from '@ssgoi/react/view-transitions'

const config: SsgoiConfig = {
  transitions: [
    {
      from: "/*", to: "/profile", transition: fade()
    },
    {
      from: "/posts", to: "/posts/*", transition: hero()
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Ssgoi config={config}>
      {children}
    </Ssgoi>
  )
}
\`\`\`

\`\`\`tsx
// app/posts/page.tsx
import { SsgoiTransition } from '@ssgoi/react'

export default function PostsPage() {
  return (
    <SsgoiTransition id="/posts">
      <div>
        <h1>Posts List</h1>
        {/* Page Content */}
      </div>
    </SsgoiTransition>
  )
}
\`\`\`
`;

export function CodeExample() {
  return (
    <div className="mt-16 rounded-2xl border border-border bg-card p-8">
      <div className="mb-4 flex items-center gap-3">
        <div className="h-3 w-3 rounded-full bg-vivid-red" />
        <div className="h-3 w-3 rounded-full bg-vivid-yellow" />
        <div className="h-3 w-3 rounded-full bg-vivid-green" />
      </div>
      <MdxRemote source={codeExample} />
    </div>
  );
}
