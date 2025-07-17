import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

// Syntax highlighting styles are in globals.css

interface MDXContentProps {
  content: string
}

const components = {
  // Custom components for MDX content can be added here
  h1: (props: any) => <h1 className="text-3xl font-bold mt-8 mb-4 text-white" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-semibold mt-6 mb-3 text-white" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-semibold mt-4 mb-2 text-white" {...props} />,
  p: (props: any) => <p className="mb-4 text-gray-300 leading-relaxed" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-1" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-6 mb-4 text-gray-300 space-y-1" {...props} />,
  li: (props: any) => <li className="mb-1" {...props} />,
  code: (props: any) => {
    const { children, className, ...rest } = props
    // Check if it's inline code (no className) or code block (has className)
    const isInline = !className
    
    if (isInline) {
      return <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-sm text-orange-400 font-mono" {...rest}>{children}</code>
    }
    
    // For code blocks, let the pre component handle styling
    return <code className={className} {...rest}>{children}</code>
  },
  pre: (props: any) => {
    const { children, ...rest } = props
    return (
      <pre className="hljs bg-zinc-900 border border-zinc-800 p-4 rounded-lg overflow-x-auto mb-4 text-sm" {...rest}>
        {children}
      </pre>
    )
  },
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-orange-500 pl-4 italic my-4 text-gray-400" {...props} />
  ),
  a: (props: any) => (
    <a className="text-orange-400 hover:text-orange-300 underline transition-colors" {...props} />
  ),
  strong: (props: any) => <strong className="font-bold text-white" {...props} />,
  em: (props: any) => <em className="italic text-gray-300" {...props} />,
  hr: (props: any) => <hr className="border-zinc-800 my-8" {...props} />,
  table: (props: any) => (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full divide-y divide-zinc-800" {...props} />
    </div>
  ),
  thead: (props: any) => <thead className="bg-zinc-900" {...props} />,
  tbody: (props: any) => <tbody className="divide-y divide-zinc-800" {...props} />,
  tr: (props: any) => <tr {...props} />,
  th: (props: any) => (
    <th className="px-4 py-2 text-left text-sm font-medium text-gray-300 uppercase tracking-wider" {...props} />
  ),
  td: (props: any) => (
    <td className="px-4 py-2 text-sm text-gray-300" {...props} />
  ),
}

const mdxOptions = {
  mdxOptions: {
    rehypePlugins: [
      rehypeHighlight,
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
  },
}

export async function MDXContent({ content }: MDXContentProps) {
  return <MDXRemote source={content} components={components} options={mdxOptions} />
}