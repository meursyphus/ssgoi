"use client";

import { motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Inbox,
  Tag,
  Users,
  Star,
  Clock,
  Send,
  File,
  Mails,
  Trash2,
  Settings,
  CircleHelp,
  type LucideIcon,
} from "lucide-react";
import {
  useMail,
  type Mailbox,
  type MailboxId,
} from "@/demo/material-mail/state/mail";

const BASE = "/demo/material-mail";

const ICONS: Record<MailboxId, LucideIcon> = {
  primary: Inbox,
  promotions: Tag,
  social: Users,
  starred: Star,
  snoozed: Clock,
  sent: Send,
  drafts: File,
  all: Mails,
  trash: Trash2,
};

// M3 emphasized decelerate in, emphasized accelerate out.
const ENTER = { duration: 0.4, ease: [0.05, 0.7, 0.1, 1] } as const;
const EXIT = { duration: 0.2, ease: [0.3, 0, 0.8, 0.15] } as const;

export function NavDrawer({
  height,
  scroller,
}: {
  height: number;
  scroller: HTMLElement | null;
}) {
  const mail = useMail((s) => ({
    mailbox: s.mailbox,
    mailboxes: s.mailboxes,
    actions: s.actions,
  }));
  const pathname = usePathname();
  const router = useRouter();

  const pick = (id: MailboxId) => {
    void mail.actions.selectMailbox(id);
    if (pathname !== BASE) router.push(BASE, { scroll: false });
    else scroller?.scrollTo({ top: 0 });
  };
  const mocked = (label: string) => {
    mail.actions.closeDrawer();
    toast(`${label} is mocked in this demo`);
  };

  const item = (box: Mailbox) => (
    <DrawerItem
      key={box.id}
      icon={ICONS[box.id]}
      label={box.label}
      count={box.count}
      active={box.id === mail.mailbox}
      onClick={() => pick(box.id)}
    />
  );

  return (
    <>
      <motion.div
        aria-hidden
        onClick={() => mail.actions.closeDrawer()}
        className="absolute inset-x-0 top-0 touch-none bg-black/40"
        style={{ height }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: ENTER }}
        exit={{ opacity: 0, transition: EXIT }}
      />
      <motion.nav
        aria-label="Mailboxes"
        className="absolute top-0 left-0 flex w-[82%] max-w-[330px] flex-col overflow-y-auto overscroll-contain rounded-r-[28px] bg-[#F3F3FA] pb-4 shadow-2xl"
        style={{ height }}
        initial={{ x: "-100%" }}
        animate={{ x: 0, transition: ENTER }}
        exit={{ x: "-100%", transition: EXIT }}
      >
        <div className="flex items-center gap-3 px-7 pt-6 pb-4">
          <img
            src="/material-mail-icon.svg"
            alt=""
            width={26}
            height={26}
            className="h-[26px] w-[26px]"
          />
          <span className="text-[20px] text-neutral-800">Material Mail</span>
        </div>
        {mail.mailboxes.data.categories.map(item)}
        <div className="mx-7 my-2 border-t border-neutral-300/60" />
        <p className="px-7 pt-2 pb-1 text-[12px] font-medium tracking-wide text-neutral-500 uppercase">
          All labels
        </p>
        {mail.mailboxes.data.labels.map(item)}
        <div className="mx-7 my-2 border-t border-neutral-300/60" />
        <DrawerItem
          icon={Settings}
          label="Settings"
          onClick={() => mocked("Settings")}
        />
        <DrawerItem
          icon={CircleHelp}
          label="Help & feedback"
          onClick={() => mocked("Help & feedback")}
        />
      </motion.nav>
    </>
  );
}

function DrawerItem({
  icon: Icon,
  label,
  count = null,
  active = false,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  count?: number | null;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`mx-3 flex h-12 shrink-0 items-center gap-4 rounded-full px-4 text-left text-[14px] font-medium transition-colors ${
        active
          ? "bg-indigo-100 text-indigo-900"
          : "text-neutral-700 active:bg-neutral-200/70"
      }`}
    >
      <Icon size={20} strokeWidth={2} className="shrink-0" />
      <span className="flex-1">{label}</span>
      {count !== null && (
        <span className="text-[12px] font-semibold">{count}</span>
      )}
    </button>
  );
}
