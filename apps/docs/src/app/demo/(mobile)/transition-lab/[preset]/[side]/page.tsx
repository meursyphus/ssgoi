import { notFound } from "next/navigation";
import { TransitionLabScreen } from "@/demo/transition-lab/screen";
import {
  isTransitionLabPreset,
  isTransitionLabSide,
} from "@/demo/transition-lab/presets";

export default async function TransitionLabPage({
  params,
}: {
  params: Promise<{ preset: string; side: string }>;
}) {
  const { preset, side } = await params;
  if (!isTransitionLabPreset(preset) || !isTransitionLabSide(side)) {
    notFound();
  }

  return <TransitionLabScreen preset={preset} side={side} />;
}
