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
  const { getTransition } = useSsgoi();
  return (
    <div
      ref={transition({
        key: id,
        in: async () => {
          return {
            spring: { stiffness: 100, damping: 10 },
            tick: (value) => {},
          };
        },
        out: async () => {
          return {
            spring: { stiffness: 100, damping: 10 },
            tick: (value) => {},
          };
        },
      })}
      data-ssgoi-transition={id}
    >
      {children}
    </div>
  );
};
