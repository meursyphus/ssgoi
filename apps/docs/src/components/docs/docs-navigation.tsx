import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface NavigationLink {
  title: string
  path: string
}

interface DocsNavigationProps {
  prev: NavigationLink | null
  next: NavigationLink | null
  lang: string
}

export function DocsNavigation({ prev, next, lang }: DocsNavigationProps) {
  if (!prev && !next) {
    return null
  }

  return (
    <nav className="mt-16 pt-8 border-t border-zinc-700">
      <div className="flex items-center justify-between gap-4">
        {prev ? (
          <Link
            href={`/${lang}/docs/${prev.path}`}
            className="group flex items-center gap-3 px-4 py-3 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/80 hover:border-zinc-700 transition-all min-w-0 flex-1"
          >
            <ChevronLeft className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors flex-shrink-0" />
            <div className="text-left min-w-0">
              <div className="text-xs text-zinc-500 group-hover:text-zinc-400 mb-1 transition-colors">Previous</div>
              <div className="text-white font-medium truncate">{prev.title}</div>
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        
        {next ? (
          <Link
            href={`/${lang}/docs/${next.path}`}
            className="group flex items-center gap-3 px-4 py-3 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/80 hover:border-zinc-700 transition-all min-w-0 flex-1"
          >
            <div className="text-right min-w-0 flex-1">
              <div className="text-xs text-zinc-500 group-hover:text-zinc-400 mb-1 transition-colors">Next</div>
              <div className="text-white font-medium truncate">{next.title}</div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors flex-shrink-0" />
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </nav>
  )
}