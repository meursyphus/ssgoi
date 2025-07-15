"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Github, Menu, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 sm:px-8">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold gradient-text">SSGOI</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/docs"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                문서
              </Link>
              <Link
                href="/examples"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                예제
              </Link>
              <Link
                href="/showcase"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                쇼케이스
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/your-repo/ssgoi"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                "h-9 w-9"
              )}
            >
              <Github className="h-5 w-5" />
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
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border">
          <nav className="flex flex-col space-y-2 p-4">
            <Link
              href="/docs"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              문서
            </Link>
            <Link
              href="/examples"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              예제
            </Link>
            <Link
              href="/showcase"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              쇼케이스
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}