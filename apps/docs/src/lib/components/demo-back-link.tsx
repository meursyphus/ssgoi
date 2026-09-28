"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Link } from "@/lib/link";
import { goBackInDemo, type DemoPathMatch } from "@/lib/demo-history";

export type DemoBackLinkProps = Omit<
  ComponentPropsWithoutRef<typeof Link>,
  "href" | "onNavigate"
> & {
  /**
   * Where Back goes when no in-demo entry is behind this screen (direct
   * entry, reload, a showcase clip's first leg). Pick the parent whose route
   * rule resolves backward for this screen.
   */
  fallback: string;
  /** See `DemoBackOptions.match` in `@/lib/hooks`. */
  match?: DemoPathMatch;
};

/**
 * The back/close affordance for mobile demos. It is a prefetched `Link` to
 * `fallback` that, when an in-demo entry is behind this screen, goes back
 * through history instead, so SSGOI replays the recorded effect in reverse
 * (zoom into the tile it came from, drill out, sheet down).
 *
 * The fallback *replaces* the current entry, so a closed screen is not left
 * in history for the parent's own back to reopen. A replace resolves the
 * same rule a push would: `on` leave, reversed `from`/`to` and `ordered`
 * rules decide the direction themselves.
 *
 * Modifier clicks and taps before hydration behave like a plain link to
 * `fallback`. Defaults (`replace`, `scroll={false}`) can be overridden.
 */
export const DemoBackLink = forwardRef<HTMLAnchorElement, DemoBackLinkProps>(
  function DemoBackLink({ fallback, match, ...props }, ref) {
    return (
      <Link
        ref={ref}
        replace
        scroll={false}
        {...props}
        href={fallback}
        onNavigate={(event) => {
          if (goBackInDemo(match)) event.preventDefault();
        }}
      />
    );
  },
);
