"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { ChevronRight, Home, Book, Code, Sparkles } from "lucide-react"
import { useState } from "react"

interface SidebarItem {
  title: string
  href?: string
  items?: SidebarItem[]
  icon?: React.ComponentType<{ className?: string }>
}

const sidebarItems: SidebarItem[] = [
  {
    title: "홈",
    href: "/",
    icon: Home,
  },
  {
    title: "시작하기",
    icon: Book,
    items: [
      { title: "SSGOI란", href: "/docs/getting-started/introduction" },
      { title: "설치", href: "/docs/getting-started/installation" },
      { title: "개별요소 애니메이션", href: "/docs/getting-started/element-animation" },
      { title: "페이지전환 애니메이션", href: "/docs/getting-started/page-transitions" },
    ],
  },
  {
    title: "핵심개념",
    icon: Sparkles,
    items: [
      { title: "DOM 생명주기와 애니메이션", href: "/docs/core-concepts/dom-lifecycle" },
      { title: "Transition API 상세", href: "/docs/core-concepts/transition-api" },
      { title: "4가지 전환 시나리오", href: "/docs/core-concepts/transition-scenarios" },
      { title: "prepare와 레이아웃 관리", href: "/docs/core-concepts/prepare-layout" },
    ],
  },
  {
    title: "API 레퍼런스",
    icon: Code,
    items: [
      { title: "Core 패키지", href: "/docs/api/core-package" },
      { title: "transition 함수", href: "/docs/api/transition-function" },
      { title: "SsgoiProvider와 SsgoiTransition", href: "/docs/api/provider-transition" },
      { title: "트랜지션 프리셋", href: "/docs/api/transition-presets" },
      { title: "타입 정의", href: "/docs/api/type-definitions" },
    ],
  },
]

interface CollapsibleSectionProps {
  item: SidebarItem
  pathname: string
}

function CollapsibleSection({ item, pathname }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(
    item.items?.some(subItem => pathname === subItem.href) ?? false
  )
  
  const Icon = item.icon

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        )}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4" />}
          {item.title}
        </div>
        <ChevronRight
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-90"
          )}
        />
      </button>
      {isOpen && item.items && (
        <div className="ml-6 space-y-1">
          {item.items.map((subItem) => (
            <Link
              key={subItem.href}
              href={subItem.href || "#"}
              className={cn(
                "block rounded-md px-3 py-2 text-sm transition-colors",
                pathname === subItem.href
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {subItem.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 border-r border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <ScrollArea className="h-full px-4 py-6">
        <nav className="space-y-4">
          {sidebarItems.map((item) => {
            if (item.href) {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {item.title}
                </Link>
              )
            }
            
            return (
              <CollapsibleSection
                key={item.title}
                item={item}
                pathname={pathname}
              />
            )
          })}
        </nav>
      </ScrollArea>
    </aside>
  )
}