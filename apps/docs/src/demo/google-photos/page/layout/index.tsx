import type { ReactNode } from "react";
import { GooglePhotosLayoutClient } from "./client";

export default function GooglePhotosLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <GooglePhotosLayoutClient>{children}</GooglePhotosLayoutClient>;
}
