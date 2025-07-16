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

  return (
    <div ref={transition(getTransition(id))} data-ssgoi-transition={id}>
      {children}
    </div>
  );
};
