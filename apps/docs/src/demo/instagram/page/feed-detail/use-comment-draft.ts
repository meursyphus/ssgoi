"use client";

import { useRef, useState } from "react";

/**
 * 댓글 입력창 상태. 목록의 "답글 달기"가 입력창을 "@유저 "로 채우고
 * 포커스하도록 목록과 입력창이 함께 쓴다.
 */
export function useCommentDraft() {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const replyTo = (user: string) => {
    setText(`@${user} `);
    inputRef.current?.focus();
  };
  return { text, setText, inputRef, replyTo };
}
