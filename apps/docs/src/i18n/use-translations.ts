/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client";

import { useContext } from "react";
import { ReactNode } from "react";
import { TranslationsContext } from "./internal/client-translations-provider";
import { interpolate } from "./internal/interpolate";
import { Messages } from "./messages/types";
import {
  NestedKeyOf,
  NestedValueOf,
  getNestedValue,
  isReactNode,
} from "./internal/translation-utils";

export function useTranslations<Namespace extends keyof Messages>(
  namespace: Namespace,
) {
  const { messages } = useContext(TranslationsContext);

  function t<
    Key extends NestedKeyOf<Messages[Namespace]>,
    Variables extends { [key: string]: any } = {},
  >(
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

    if (typeof value === "string") {
      if (variables) {
        return interpolate(value, variables) as any;
      } else {
        return value as any;
      }
    } else if (isReactNode(value)) {
      return value as any;
    } else {
      console.warn(
        `Translation for key "${namespace}.${key}" is not a valid type.`,
      );
      return key as any;
    }
  }

  return t;
}
