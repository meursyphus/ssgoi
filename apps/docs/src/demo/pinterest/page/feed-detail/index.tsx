"use client";

import { usePin, type PinDetail } from "@/demo/pinterest/state/pin";
import { BackButton } from "./back-button";
import { HeroImage } from "./hero-image";
import { ActionBar } from "./action-bar";
import { VisitSite } from "./visit-site";
import { RelatedPins } from "./related-pins";
import type { PinSimple } from "@/demo/pinterest/api/pin";
export default function FeedDetailPage({
  initialData,
  relatedPins,
}: {
  initialData: PinDetail;
  relatedPins: PinSimple[];
}) {
  const pinState = usePin((state) => ({
    actions: state.actions,
  }));
  pinState.actions.init(initialData);
  return (
    <div className="flex min-h-full flex-col bg-white">
      <div className="relative">
        <BackButton />
        <HeroImage pin={initialData} />
      </div>
      <ActionBar pin={initialData} />
      <VisitSite pin={initialData} />
      <RelatedPins pins={relatedPins} />
    </div>
  );
}
