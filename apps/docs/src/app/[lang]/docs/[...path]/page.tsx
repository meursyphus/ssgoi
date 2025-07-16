import { notFound } from 'next/navigation'
import { getPost } from '@/lib/post'
import { MDXContent } from './mdx-content'

interface DocsPageProps {
  params: Promise<{
    lang: string
    path: string[]
  }>
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { lang, path } = await params
  const postPath = path.join('/')
  
  const post = await getPost(`@apps/docs/content/${lang}`, postPath)
  
  if (!post) {
    notFound()
  }
  
  return (
    <article className="prose prose-lg max-w-none">
      <h1>{post.title}</h1>
      {post.description && (
        <p className="text-xl text-gray-600">{post.description}</p>
      )}
      <MDXContent content={post.content} />
    </article>
  )
}