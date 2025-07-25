import { notFound } from 'next/navigation'
import { getPost, getNavigationData } from '@/lib/post'
import { MDXContent } from './mdx-content'
import { DocsNavigation } from '@/components/docs-navigation'
import { findNavigationLinks } from '@/lib/navigation-utils'

interface DocsPageProps {
  params: Promise<{
    lang: string
    path: string[]
  }>
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { lang, path } = await params
  const postPath = path.join('/')
  
  const [post, navigation] = await Promise.all([
    getPost(lang, postPath),
    getNavigationData(lang)
  ])
  
  if (!post) {
    notFound()
  }
  
  // Find previous and next navigation links
  const currentPath = `/${lang}/docs/${postPath}`
  const { prev, next } = findNavigationLinks(navigation, currentPath, lang)
  
  return (
    <article className="max-w-none">
      <h1 className="text-4xl font-bold mb-4 text-white">{post.title}</h1>
      {post.description && (
        <p className="text-xl text-gray-400 mb-8">{post.description}</p>
      )}
      {await MDXContent({ content: post.content })}
      <DocsNavigation prev={prev} next={next} lang={lang} />
    </article>
  )
}