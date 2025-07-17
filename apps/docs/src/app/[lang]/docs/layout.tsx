import { getNavigationData } from '@/lib/post'
import { Sidebar } from './sidebar'

interface DocsLayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

export default async function DocsLayout({ children, params }: DocsLayoutProps) {
  const { lang } = await params
  const navigation = await getNavigationData(lang)
  
  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-zinc-950 pt-16">
      <Sidebar navigation={navigation} lang={lang} />
      <main className="flex-1 md:ml-64">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}