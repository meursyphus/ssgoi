import { getNavigationData } from '@/lib/post'
import { Sidebar } from './sidebar'

interface DocsLayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

export default async function DocsLayout({ children, params }: DocsLayoutProps) {
  const { lang } = await params
  const navigation = await getNavigationData(`@apps/docs/content/${lang}`)
  
  return (
    <div className="flex min-h-screen">
      <Sidebar navigation={navigation} lang={lang} />
      <main className="flex-1 ml-64 px-4 py-8 md:px-8">
        <div className="mx-auto max-w-4xl">
          {children}
        </div>
      </main>
    </div>
  )
}