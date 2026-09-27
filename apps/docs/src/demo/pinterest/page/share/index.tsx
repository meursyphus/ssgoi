"use client";

import type { ShareSheet } from "@/demo/pinterest/state/pin";
import { ShareHeader } from "./share-header";
import { PinPreview } from "./pin-preview";
import { SendRow } from "./send-row";
import { AppRow } from "./app-row";
import { OptionList } from "./option-list";

export default function SharePage({
  initialData,
}: {
  initialData: ShareSheet;
}) {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <ShareHeader pinId={initialData.pin.id} />
      <PinPreview pin={initialData.pin} />
      <SendRow contacts={initialData.contacts} />
      <AppRow pinId={initialData.pin.id} />
      <OptionList />
    </div>
  );
}
