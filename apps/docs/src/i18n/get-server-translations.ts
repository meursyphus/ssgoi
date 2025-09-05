/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";
import { Messages } from "./messages/types";
import { loadTranslations } from "./internal/load-translations";
import { interpolate } from "./internal/interpolate";
import {
  NestedKeyOf,
  NestedValueOf,
  getNestedValue,
} from "./internal/translation-utils";

type Variables = { [key: string]: string | number };

export async function getServerTranslations<Namespace extends keyof Messages>(
  namespace: Namespace,
  lang: string,
) {
  const messages = await loadTranslations(lang);

  function t<Key extends NestedKeyOf<Messages[Namespace]>>(
    key: Key,
    variables?: Variables,
  ): NestedValueOf<Messages[Namespace], Key> extends string
    ? string
    : NestedValueOf<Messages[Namespace], Key> extends ReactNode
      ? ReactNode
      : string {
    const value = getNestedValue(messages[namespace], key);

    if (!value) {
      console.warn(`Translation for key "${namespace}.${key}" not found.`);
      return key as any;
    }

    if (typeof value === "string" && variables) {
      return interpolate(value, variables) as any;
    }

    return value;
  }

  return t;
}
