import { redirect } from 'next/navigation'
import { getNavigationData } from '@/lib/post'

interface DocsIndexPageProps {
  params: Promise<{ lang: string }>
}

export default async function DocsIndexPage({ params }: DocsIndexPageProps) {
  const { lang } = await params
  const navigation = await getNavigationData(`@apps/docs/content/${lang}`)
  
  // Redirect to the first available document
  if (navigation.length > 0) {
    const firstItem = navigation[0]
    const firstPath = firstItem.children?.[0]?.path || firstItem.path
    redirect(`/${lang}/docs/${firstPath}`)
  }
  
  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold mb-4">Welcome to SSGOI Documentation</h1>
      <p className="text-gray-600">No documentation found for this language.</p>
    </div>
  )
}