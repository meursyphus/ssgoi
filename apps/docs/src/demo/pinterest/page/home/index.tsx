"use client";

import { useEffect } from "react";
import { usePin } from "@/demo/pinterest/state/pin";
import { HomeHeader } from "./header";
import { TabBar } from "./tab-bar";
import { Masonry } from "./masonry";
import { BottomNav } from "../shared/bottom-nav";
export default function HomePage() {
  const pinState = usePin((state) => ({
    actions: state.actions,
  }));
  useEffect(() => {
    pinState.actions.loadPins();
  }, [pinState.actions]);
  return (
    <div className="flex min-h-full flex-col bg-white">
      <HomeHeader />
      <TabBar />
      <div className="flex-1 pt-2">
        <Masonry />
        <div className="h-4" />
      </div>
      <BottomNav />
    </div>
  );
}
