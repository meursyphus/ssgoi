'use client'

import { MDXRemote } from 'next-mdx-remote/rsc'
import { Suspense } from 'react'

interface MDXContentProps {
  content: string
}

const components = {
  // Custom components for MDX content can be added here
  h1: (props: any) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-semibold mt-6 mb-3" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-semibold mt-4 mb-2" {...props} />,
  p: (props: any) => <p className="mb-4" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-6 mb-4" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-6 mb-4" {...props} />,
  li: (props: any) => <li className="mb-1" {...props} />,
  code: (props: any) => {
    const { children, ...rest } = props
    return <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...rest}>{children}</code>
  },
  pre: (props: any) => (
    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4" {...props} />
  ),
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />
  ),
}

export function MDXContent({ content }: MDXContentProps) {
  return (
    <Suspense fallback={<div>Loading content...</div>}>
      <MDXRemote source={content} components={components} />
    </Suspense>
  )
}