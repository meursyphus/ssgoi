"use client";

import Link from "next/link";
import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left - License */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-neutral-500">MIT License</span>
            <span className="text-neutral-700">·</span>
            <span className="text-[10px] text-neutral-500">
              Free & Open Source
            </span>
          </div>

          {/* Center - Links */}
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/meursyphus/ssgoi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[10px] text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              <Github className="w-3 h-3" />
              <span>GitHub</span>
            </Link>
            <Link
              href="https://discord.gg/9gSSWQbvX4"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[10px] text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-3 h-3 fill-current"
                aria-hidden="true"
              >
                <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.02-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .02.01.04.03.05 1.8 1.32 3.53 2.12 5.24 2.65.03.01.06 0 .07-.02.4-.55.76-1.13 1.07-1.74.02-.04 0-.08-.04-.09-.57-.22-1.11-.48-1.64-.78-.04-.02-.04-.08-.01-.11.11-.08.22-.17.33-.25.02-.02.05-.02.07-.01 3.44 1.57 7.15 1.57 10.55 0 .02-.01.05-.01.07.01.11.09.22.17.33.26.04.03.04.09-.01.11-.52.31-1.07.56-1.64.78-.04.01-.05.06-.04.09.32.61.68 1.19 1.07 1.74.03.01.06.02.09.01 1.72-.53 3.45-1.33 5.25-2.65.02-.01.03-.03.03-.05.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.83 2.12-1.89 2.12z" />
              </svg>
              <span>Discord</span>
            </Link>
            <Link
              href="https://x.com/meursyphus"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[10px] text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-3 h-3 fill-current"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>X</span>
            </Link>
          </div>

          {/* Right - Credit */}
          <span className="text-[10px] text-neutral-500">
            Built with care by MeurSyphus
          </span>
        </div>
      </div>
    </footer>
  );
}
