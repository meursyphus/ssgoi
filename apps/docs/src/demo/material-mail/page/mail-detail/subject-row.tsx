"use client";

import { motion } from "motion/react";
import { Star } from "lucide-react";
import { useMail, type MailDetail } from "@/demo/material-mail/state/mail";

export function SubjectRow({ mail: data }: { mail: MailDetail }) {
  const mail = useMail((s) => ({ current: s.current, actions: s.actions }));
  // The live copy carries this session's star and archive / trash moves.
  const live = mail.current?.id === data.id ? mail.current : data;
  const starred = live.starred;

  return (
    <div className="flex items-start gap-2 px-4 pt-2 pb-4">
      <div className="flex flex-1 flex-wrap items-center gap-x-2 gap-y-1.5">
        <h1 className="text-[22px] leading-snug text-neutral-900">
          {data.subject}
        </h1>
        {live.label && (
          <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[12px] text-neutral-600">
            {live.label}
          </span>
        )}
      </div>
      <motion.button
        type="button"
        onClick={() => void mail.actions.toggleStar(data.id)}
        aria-label={starred ? "Unstar" : "Star"}
        aria-pressed={starred}
        whileTap={{ scale: 0.8 }}
        className="-mr-1 rounded-full p-2 active:bg-neutral-100"
      >
        <motion.span
          className="block"
          initial={false}
          animate={starred ? { scale: [1, 1.35, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Star
            size={22}
            strokeWidth={1.75}
            fill={starred ? "#F5B100" : "none"}
            className={starred ? "text-amber-500" : "text-neutral-400"}
          />
        </motion.span>
      </motion.button>
    </div>
  );
}
