import type { ReactNode } from "react";
import { AirbnbPhotoTourLayoutClient } from "./client";

export default function AirbnbPhotoTourLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AirbnbPhotoTourLayoutClient>{children}</AirbnbPhotoTourLayoutClient>;
}
