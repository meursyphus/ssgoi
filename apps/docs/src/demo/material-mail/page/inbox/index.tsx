"use client";

import { useEffect } from "react";
import { useMail } from "@/demo/material-mail/state/mail";
import { TopBar } from "../shared/top-bar";
import { InboxList } from "./inbox-list";
import { ComposeFab } from "./compose-fab";

export default function InboxPage() {
  const mail = useMail((s) => ({
    actions: s.actions,
  }));

  useEffect(() => {
    mail.actions.loadMails();
  }, [mail.actions]);

  // The FAB row stays outside the scrolled content block so the compose sheet
  // does not drag it along. Same approach as gamja-market's FloatingBottom.
  // It is zero-height so an empty mailbox does not scroll; the bottom nav
  // lives in the (tabs) shell, 70px plus the bottom safe area below the FAB's
  // sticky line.
  return (
    <>
      <div className="flex flex-1 flex-col bg-[#FAFAFE]">
        <TopBar />
        <div className="flex-1 pb-20">
          <InboxList />
        </div>
      </div>
      <div className="pointer-events-none sticky bottom-safe-20 z-20 h-0">
        <div className="pointer-events-auto absolute right-5 bottom-0">
          <ComposeFab />
        </div>
      </div>
    </>
  );
}
