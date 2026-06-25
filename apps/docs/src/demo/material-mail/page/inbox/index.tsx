"use client";

import { useEffect } from "react";
import { useMail } from "@/demo/material-mail/state/mail";
import { TopBar } from "./top-bar";
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
  return (
    <>
      <div className="flex min-h-full flex-col bg-[#FAFAFE]">
        <TopBar />
        <div className="flex-1 pb-4">
          <InboxList />
        </div>
      </div>
      <div className="sticky bottom-4 z-20 flex justify-end px-5 pointer-events-none">
        <div className="pointer-events-auto">
          <ComposeFab />
        </div>
      </div>
    </>
  );
}
