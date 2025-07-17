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
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-20">
              <Sidebar navigation={navigation} lang={lang} />
            </div>
          </aside>
          
          {/* Main content */}
          <main className="flex-1 min-w-0">
            <div className="py-8">
              <div className="mx-auto max-w-4xl">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
      
      {/* Mobile sidebar */}
      <div className="md:hidden">
        <Sidebar navigation={navigation} lang={lang} />
      </div>
    </div>
  )
}