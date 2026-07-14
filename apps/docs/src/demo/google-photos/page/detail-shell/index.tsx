import type { ReactNode } from "react";
import { GooglePhotosDetailShell } from "./client";

export default function DetailShell({ children }: { children: ReactNode }) {
  return <GooglePhotosDetailShell>{children}</GooglePhotosDetailShell>;
}
