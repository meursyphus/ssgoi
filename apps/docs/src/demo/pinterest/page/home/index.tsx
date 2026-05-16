"use client";

import { useEffect } from "react";
import { SsgoiTransition } from "@ssgoi/react";
import { usePin } from "@/demo/pinterest/state/pin";
import { HomeHeader } from "./header";
import { TabBar } from "./tab-bar";
import { Masonry } from "./masonry";
import { RefreshPill } from "./refresh-pill";
import { BottomNav } from "../shared/bottom-nav";

export default function HomePage() {
  const pinState = usePin((state) => ({ actions: state.actions }));

  useEffect(() => {
    pinState.actions.loadPins();
  }, [pinState.actions]);

  return (
    <SsgoiTransition
      id="/demo/pinterest"
      className="flex min-h-full flex-col bg-black"
    >
      <HomeHeader />
      <TabBar />
      <div className="relative flex-1 pt-2">
        <RefreshPill />
        <Masonry />
        <div className="h-4" />
      </div>
      <BottomNav />
    </SsgoiTransition>
  );
}
