"use client";

import { motion } from "motion/react";
import { toast } from "sonner";
import { X, UserPlus, UserCog } from "lucide-react";
import { useMail } from "@/demo/material-mail/state/mail";

export function AccountCard({ height }: { height: number }) {
  const mail = useMail((s) => ({ actions: s.actions }));
  const mocked = (label: string) => {
    mail.actions.closeAccount();
    toast(`${label} is mocked in this demo`);
  };

  return (
    <>
      <motion.div
        aria-hidden
        onClick={() => mail.actions.closeAccount()}
        className="absolute inset-x-0 top-0 touch-none bg-black/40"
        style={{ height }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        role="dialog"
        aria-label="Account"
        className="absolute inset-x-3 top-16 origin-top rounded-[28px] bg-[#F3F3FA] p-2 shadow-2xl"
        initial={{ opacity: 0, scale: 0.94, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: -4 }}
        transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
      >
        <div className="relative flex h-12 items-center justify-center">
          <button
            type="button"
            onClick={() => mail.actions.closeAccount()}
            className="absolute left-1 rounded-full p-2 text-neutral-700 active:bg-neutral-200/70"
            aria-label="Close"
          >
            <X size={20} strokeWidth={2.25} />
          </button>
          <span className="text-[16px] text-neutral-800">Material Mail</span>
        </div>
        <div className="rounded-3xl bg-white px-4 pt-4 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-[16px] font-semibold text-white">
              M
            </div>
            <div className="min-w-0">
              <div className="text-[15px] font-medium text-neutral-900">
                Minseo Kang
              </div>
              <div className="truncate text-[13px] text-neutral-500">
                me@example.com
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => mocked("Account settings")}
            className="mt-4 ml-[52px] rounded-full border border-neutral-300 px-4 py-1.5 text-[14px] font-medium text-neutral-800 active:bg-neutral-100"
          >
            Manage your account
          </button>
        </div>
        <div className="mt-1 flex flex-col overflow-hidden rounded-3xl bg-white">
          <AccountRow
            icon={UserPlus}
            label="Add another account"
            onClick={() => mocked("Adding an account")}
          />
          <div className="mx-4 border-t border-neutral-100" />
          <AccountRow
            icon={UserCog}
            label="Manage accounts on this device"
            onClick={() => mocked("Account management")}
          />
        </div>
      </motion.div>
    </>
  );
}

function AccountRow({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof UserPlus;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-14 items-center gap-4 px-5 text-left text-[14px] text-neutral-800 active:bg-neutral-100"
    >
      <Icon size={20} strokeWidth={2} className="text-neutral-600" />
      {label}
    </button>
  );
}
