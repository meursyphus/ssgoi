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

  // Two siblings inside the mobile-frame scroll container:
  //  1. data-ssgoi-transition wrapper — the transition target (TopBar + list).
  //  2. The FAB row — sticky to the bottom of the scroll container, but
  //     *outside* the transition boundary so the sheet/scale animation doesn't drag
  //     it along. Same approach as gamja-market's FloatingBottom.
  return (
    <>
      <div
        data-ssgoi-transition="/demo/material-mail"
        className="flex min-h-full flex-col bg-[#FAFAFE]"
      >
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
