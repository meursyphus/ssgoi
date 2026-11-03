"use client";

import Link from "next/link";
import { useState, type ComponentProps } from "react";

/**
 * A list card link. With the `ssgoi-noprefetch=1` cookie the link does not
 * prefetch, so the detail's shell is fetched on click and, on a slow network,
 * commits frames after the list is hidden — the incoming page arrives late.
 */
export function CardLink(props: ComponentProps<typeof Link>) {
  const [noPrefetch] = useState(
    () =>
      typeof document !== "undefined" &&
      document.cookie.includes("ssgoi-noprefetch=1"),
  );
  return <Link {...props} prefetch={noPrefetch ? false : undefined} />;
}
