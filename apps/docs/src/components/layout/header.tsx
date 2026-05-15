"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu, Github } from "lucide-react";
import { useState } from "react";
import { messages } from "@/messages";
import { MobileDrawer } from "./mobile-drawer";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function Header() {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || (path !== "/" && pathname.startsWith(path));
  };

  return (
    <>
      {/* Mobile Header - Center floating */}
      <header className="md:hidden fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <div className="px-4 py-2 rounded-full bg-neutral-900/70 backdrop-blur-md border border-white/10">
          <Link href={`/`} className="flex items-center gap-2">
            <Image
              src="/ssgoi-logo.png"
              alt="SSGOI Logo"
              width={24}
              height={24}
              className="h-6 w-6 rounded-full object-cover"
            />
            <span className="text-sm font-medium tracking-tight">SSGOI</span>
          </Link>
        </div>
      </header>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 right-4 z-50 h-9 w-9 flex items-center justify-center rounded-full bg-neutral-900/70 backdrop-blur-md border border-white/10 text-neutral-300 hover:text-white transition-colors"
        onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
      >
        <Menu className="h-4 w-4" />
        <span className="sr-only">{messages.header.openMenu}</span>
      </button>

      {/* Desktop Header - Center floating */}
      <header className="hidden md:flex justify-center fixed w-[660px]  top-4 left-1/2 -translate-x-1/2 z-50 px-2 py-2 rounded-full bg-neutral-900/70 backdrop-blur-md border border-white/10">
        <div className="flex items-center gap-2 px-2">
          {/* Logo */}
          <Link href={`/`} className="flex items-center gap-2 shrink-0">
            <Image
              src="/ssgoi-logo.png"
              alt="SSGOI Logo"
              width={24}
              height={24}
              className="h-6 w-6 rounded-full object-cover"
            />
            <span className="text-sm font-medium tracking-tight">SSGOI</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-0.5">
            <Link
              href={`/docs`}
              className={cn(
                "px-3 py-1.5 text-xs rounded-full transition-colors",
                isActive(`/docs`)
                  ? "bg-white/10 text-white"
                  : "text-neutral-300 hover:text-white",
              )}
            >
              {messages.header.docs}
            </Link>
            <Link
              href={`/blog`}
              className={cn(
                "px-3 py-1.5 text-xs rounded-full transition-colors",
                isActive(`/blog`)
                  ? "bg-white/10 text-white"
                  : "text-neutral-300 hover:text-white",
              )}
            >
              {messages.header.blog}
            </Link>
            <Link
              href={`/demo`}
              className={cn(
                "px-3 py-1.5 text-xs rounded-full transition-colors",
                isActive(`/demo`)
                  ? "bg-white/10 text-white"
                  : "text-neutral-300 hover:text-white",
              )}
            >
              {messages.header.demo}
            </Link>
            <Link
              href={`/showcase`}
              className={cn(
                "px-3 py-1.5 text-xs rounded-full transition-colors",
                isActive(`/showcase`)
                  ? "bg-white/10 text-white"
                  : "text-neutral-300 hover:text-white",
              )}
            >
              {messages.header.showcase}
            </Link>
          </nav>

          {/* Separator */}
          <div className="w-px h-4 bg-white/10" />

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            {/* Discord */}
            <Link
              href="https://discord.gg/9gSSWQbvX4"
              target="_blank"
              rel="noopener noreferrer"
              className="h-7 w-7 flex items-center justify-center rounded-full text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Discord"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 fill-current"
                aria-hidden="true"
              >
                <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.02-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .02.01.04.03.05 1.8 1.32 3.53 2.12 5.24 2.65.03.01.06 0 .07-.02.4-.55.76-1.13 1.07-1.74.02-.04 0-.08-.04-.09-.57-.22-1.11-.48-1.64-.78-.04-.02-.04-.08-.01-.11.11-.08.22-.17.33-.25.02-.02.05-.02.07-.01 3.44 1.57 7.15 1.57 10.55 0 .02-.01.05-.01.07.01.11.09.22.17.33.26.04.03.04.09-.01.11-.52.31-1.07.56-1.64.78-.04.01-.05.06-.04.09.32.61.68 1.19 1.07 1.74.03.01.06.02.09.01 1.72-.53 3.45-1.33 5.25-2.65.02-.01.03-.03.03-.05.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.83 2.12-1.89 2.12z" />
              </svg>
            </Link>

            {/* X (Twitter) */}
            <Link
              href="https://x.com/meursyphus"
              target="_blank"
              rel="noopener noreferrer"
              className="h-7 w-7 flex items-center justify-center rounded-full text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="X (Twitter)"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 fill-current"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>

            {/* GitHub */}
            <Link
              href="https://github.com/meursyphus/ssgoi"
              target="_blank"
              rel="noopener noreferrer"
              className="h-7 w-7 flex items-center justify-center rounded-full text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
              aria-label={messages.header.githubRepository}
            >
              <Github className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <MobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />
    </>
  );
}
