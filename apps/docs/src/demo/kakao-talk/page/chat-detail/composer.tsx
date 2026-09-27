"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Plus, Smile, Hash, Mic, ArrowUp } from "lucide-react";
import { Input } from "@/lib/components/ui/input";
import { useChat } from "@/demo/kakao-talk/state/chat";

export function Composer() {
  const chat = useChat((state) => ({ actions: state.actions }));
  const [text, setText] = useState("");
  const canSend = text.trim().length > 0;

  return (
    <div className="border-t border-black/5 bg-white px-2 py-2">
      <form
        className="flex items-center gap-1"
        onSubmit={(e) => {
          e.preventDefault();
          if (!canSend) return;
          setText("");
          chat.actions.send(text);
        }}
      >
        <IconBtn label="첨부">
          <Plus className="h-5 w-5" />
        </IconBtn>
        <div className="flex-1">
          <Input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="메시지 입력"
            enterKeyHint="send"
            aria-label="메시지 입력"
            className="h-9 rounded-full border border-neutral-200 bg-neutral-50 px-3 text-[13px] text-neutral-900 placeholder:text-neutral-400"
          />
        </div>
        <IconBtn label="이모티콘">
          <Smile className="h-[20px] w-[20px]" />
        </IconBtn>
        {canSend ? (
          <motion.button
            type="submit"
            aria-label="전송"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 520, damping: 22 }}
            className="ml-1 flex h-9 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#FEE500] text-neutral-900"
          >
            <ArrowUp className="h-[18px] w-[18px]" strokeWidth={2.4} />
          </motion.button>
        ) : (
          <>
            <IconBtn label="샵검색">
              <Hash className="h-[18px] w-[18px]" />
            </IconBtn>
            <IconBtn label="음성">
              <Mic className="h-[18px] w-[18px]" />
            </IconBtn>
          </>
        )}
      </form>
    </div>
  );
}

function IconBtn({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-neutral-500 hover:bg-black/5"
    >
      {children}
    </button>
  );
}
