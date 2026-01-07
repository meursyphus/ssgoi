"use client";

import { useRouter } from "next/navigation";

interface BackButtonProps {
  className?: string;
}

/**
 * Client component for back navigation.
 *
 * Uses router.back() instead of <Link> to trigger proper browser history navigation.
 * This ensures popstate event fires, which is required for SSGOI's skipAnimationOnBack
 * feature to detect back navigation correctly.
 *
 * Note: <Link href="/"> creates a new history entry (push), while router.back()
 * navigates to the previous entry, triggering popstate.
 */
export function BackButton({ className }: BackButtonProps) {
  const router = useRouter();

  return (
    <button onClick={() => router.back()} className={className}>
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
          clipRule="evenodd"
        />
      </svg>
      Back
    </button>
  );
}
