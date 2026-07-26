import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { TransitionLabLayoutClient } from "@/demo/transition-lab/layout-client";
import { isTransitionLabPreset } from "@/demo/transition-lab/presets";

export default async function TransitionLabPresetLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ preset: string }>;
}) {
  const { preset } = await params;
  if (!isTransitionLabPreset(preset)) notFound();

  return (
    <TransitionLabLayoutClient preset={preset}>
      {children}
    </TransitionLabLayoutClient>
  );
}
