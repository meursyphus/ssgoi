"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ComponentProps } from "react";

interface BlogPostLinkProps extends ComponentProps<typeof Link> {
  fallbackHref: string;
}

export function BlogPostLink({ fallbackHref, ...props }: BlogPostLinkProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Check if we came from the blog list page
    if (typeof window !== "undefined" && document.referrer.includes("/blog")) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return <Link {...props} onClick={handleClick} />;
}
