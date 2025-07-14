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
        in: async (element) => {
          const transitionConfig = await getTransition(id, 'in', id);
          return transitionConfig(element);
        },
        out: async (element) => {
          const transitionConfig = await getTransition(id, 'out', id);
          return transitionConfig(element);
        },
      })}
      data-ssgoi-transition={id}
    >
      {children}
    </div>
  );
};
