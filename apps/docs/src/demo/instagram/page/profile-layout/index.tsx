import type { ReactNode } from "react";
import { InstagramProfileLayoutClient } from "./client";

export default function InstagramProfileLayout({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <InstagramProfileLayoutClient id={id}>
      {children}
    </InstagramProfileLayoutClient>
  );
}
