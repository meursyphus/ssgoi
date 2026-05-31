import type { SVGProps } from "react";
import { Link } from "@/lib/link";
import { SiteLogo } from "@/components/site-logo";

function GitHubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden {...props}>
      <path d="M8 .2a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.34c-2.23.48-2.7-1.07-2.7-1.07-.36-.93-.89-1.18-.89-1.18-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.71 1.23 1.87.87 2.33.67.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.83-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.52.56.83 1.28.83 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 8 .2Z" />
    </svg>
  );
}

type NavKey = "docs" | "blog";

const SECONDARY: Array<{ key: NavKey; label: string; href: string }> = [
  { key: "docs", label: "Docs", href: "/docs" },
  { key: "blog", label: "Blog", href: "/blog" },
];

export function SiteNav({ active }: { active?: NavKey }) {
  return (
    <header className="pointer-events-none sticky top-3 z-50 mt-3 flex justify-center px-3 md:top-4 md:mt-4">
      <nav className="pointer-events-auto inline-flex h-11 items-center gap-4 rounded-full border border-white/10 bg-[#0e0b08]/70 pl-3 pr-4 backdrop-blur md:h-12 md:gap-5 md:pl-4 md:pr-5">
        <SiteLogo />

        <span className="ml-auto flex items-center gap-4 text-sm md:gap-5">
          {SECONDARY.map(({ key, label, href }) => {
            const isActive = key === active;
            return (
              <Link
                key={key}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`relative transition-colors ${
                  isActive
                    ? "text-neutral-100"
                    : "text-neutral-400 hover:text-neutral-100"
                }`}
              >
                {label}
                {isActive && (
                  <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full bg-orange-400" />
                )}
              </Link>
            );
          })}
          <span className="h-4 w-px bg-white/15" aria-hidden />
          <a
            href="https://github.com/meursyphus/ssgoi"
            target="_blank"
            rel="noreferrer"
            className="text-neutral-400 transition-colors hover:text-neutral-100"
            aria-label="GitHub"
          >
            <GitHubIcon className="h-4 w-4" />
          </a>
        </span>
      </nav>
    </header>
  );
}
