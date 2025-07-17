"use client";

import { useContext } from "react";
import { TranslationsContext } from "./internal/client-translations-provider";
import { interpolate } from "./internal/interpolate";
import { Messages } from "./messages/types";

// 중첩된 키를 점으로 연결하여 추출하는 유틸리티 타입
type NestedKeyOf<TObj extends object> = {
  [Key in keyof TObj & (string | number)]: TObj[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<TObj[Key]>}`
    : `${Key}`;
}[keyof TObj & (string | number)];

export function useTranslations<Namespace extends keyof Messages>(
  namespace: Namespace,
) {
  const { messages } = useContext(TranslationsContext);

  function t<
    Key extends NestedKeyOf<Messages[Namespace]>,
    Variables extends { [key: string]: any } = {},
  >(key: Key, variables?: Variables): string {
    // 전체 키 생성 (네임스페이스 포함)
    const fullKey = `${namespace}.${key}`;

    // 키를 '.'으로 분할하여 중첩된 객체에서 값을 찾습니다.
    const keys = fullKey.split(".");
    let message: any = messages;

    for (const k of keys) {
      if (message && k in message) {
        message = message[k];
      } else {
        console.warn(`Translation for key "${fullKey}" not found.`);
        return fullKey;
      }
    }

    if (typeof message === "string") {
      if (variables) {
        return interpolate(message, variables);
      } else {
        return message;
      }
    } else {
      console.warn(`Translation for key "${fullKey}" is not a string.`);
      return fullKey;
    }
  }

  return t;
}
