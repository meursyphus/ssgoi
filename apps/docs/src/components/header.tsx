"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Github, Menu, X, Star } from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useSidebarStore } from "@/store/sidebar"
import { useCurrentLanguage } from "@/i18n/use-current-language"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [stars, setStars] = useState<number | null>(null)
  const pathname = usePathname()
  const { toggle: toggleSidebar } = useSidebarStore()
  const isDocsPage = pathname.includes('/docs')
  const currentLang = useCurrentLanguage()
  
  useEffect(() => {
    fetch('https://api.github.com/repos/meursyphus/ssgoi')
      .then(res => res.json())
      .then(data => setStars(data.stargazers_count))
      .catch(() => setStars(null))
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 sm:px-8">
        <div className="flex items-center gap-4">
          {/* Mobile Sidebar Toggle for Docs */}
          {isDocsPage && (
            <button
              className="md:hidden inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </button>
          )}
          
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold gradient-text">SSGOI</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href={`/${currentLang}/docs`}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              문서
            </Link>
          </nav>
        </div>
          
        <div className="ml-auto flex items-center gap-4">
          <Link
            href="https://github.com/meursyphus/ssgoi"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-2 rounded-md text-sm font-medium transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              "h-9 px-3",
              "border border-border"
            )}
          >
            <Github className="h-4 w-4" />
            {stars !== null && (
              <>
                <Star className="h-3 w-3 text-yellow-500" />
                <span>{stars}</span>
              </>
            )}
            <span className="sr-only">GitHub</span>
          </Link>
          
          <button
            className="md:hidden inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border">
          <nav className="flex flex-col space-y-2 p-4">
            <Link
              href={`/${currentLang}/docs`}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              문서
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}