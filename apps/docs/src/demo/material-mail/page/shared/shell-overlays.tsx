"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { useMail } from "@/demo/material-mail/state/mail";
import { useFrameViewport } from "./use-frame-viewport";
import { NavDrawer } from "./nav-drawer";
import { AccountCard } from "./account-card";

/** Modal layer pinned to the visible screen, above the bottom nav. */
export function ShellOverlays() {
  const mail = useMail((s) => ({
    drawerOpen: s.drawerOpen,
    accountOpen: s.accountOpen,
    actions: s.actions,
  }));
  const ref = useRef<HTMLDivElement>(null);
  const viewport = useFrameViewport(ref);
  const pathname = usePathname();
  const open = mail.drawerOpen || mail.accountOpen;
  const actions = mail.actions;

  // Browser Back / Forward while a modal is open: it must not survive the
  // route (or come back open with the tabs shell).
  useEffect(
    () => () => {
      actions.closeDrawer();
      actions.closeAccount();
    },
    [pathname, actions],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      actions.closeDrawer();
      actions.closeAccount();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, actions]);

  return (
    <div ref={ref} className="sticky top-0 z-40 h-0">
      <AnimatePresence>
        {mail.drawerOpen && (
          <NavDrawer
            key="drawer"
            height={viewport.height}
            scroller={viewport.scroller}
          />
        )}
        {mail.accountOpen && (
          <AccountCard key="account" height={viewport.height} />
        )}
      </AnimatePresence>
    </div>
  );
}
