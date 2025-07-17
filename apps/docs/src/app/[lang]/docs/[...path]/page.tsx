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
  
  const post = await getPost(lang, postPath)
  
  if (!post) {
    notFound()
  }
  
  return (
    <article className="max-w-none">
      <h1 className="text-4xl font-bold mb-4 text-white">{post.title}</h1>
      {post.description && (
        <p className="text-xl text-gray-400 mb-8">{post.description}</p>
      )}
      {await MDXContent({ content: post.content })}
    </article>
  )
}