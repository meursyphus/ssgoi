"use client";

import { SsgoiTransition } from "@ssgoi/react";
import { usePin, type PinDetail } from "@/demo/pinterest/state/pin";
import { BackButton } from "./back-button";
import { HeroImage } from "./hero-image";
import { ActionBar } from "./action-bar";
import { VisitSite } from "./visit-site";

export default function FeedDetailPage({
  initialData,
}: {
  initialData: PinDetail;
}) {
  const pinState = usePin((state) => ({ actions: state.actions }));
  pinState.actions.init(initialData);

  return (
    <SsgoiTransition
      id={`/demo/pinterest/feed/${initialData.id}`}
      className="flex min-h-full flex-col bg-white"
    >
      <div className="">
        <BackButton />
        <HeroImage pin={initialData} />
      </div>
      <ActionBar pin={initialData} />
      <div className="flex-1" />
      <VisitSite pin={initialData} />
    </SsgoiTransition>
  );
}
