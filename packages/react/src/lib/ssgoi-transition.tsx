"use client";

import type { ReactNode } from "react";
import { transition } from "./transition";
import { useSsgoi } from "./context";

export const SsgoiTransition = ({
  children,
  id,
}: {
  children: ReactNode;
  id: string;
}) => {
  const getTransition = useSsgoi();

  const transitionCallback = getTransition(id);

  return (
    <div
      ref={transition({
        key: id,
        in: (element) => {
          console.log(`[${id}] in triggered`);
          return transitionCallback?.in?.(element) ?? {};
        },
        out: (element) => {
          console.log(`[${id}] out triggered`);
          return transitionCallback?.out?.(element) ?? {};
        },
      })}
      data-ssgoi-transition={id}
    >
      {children}
    </div>
  );
};
