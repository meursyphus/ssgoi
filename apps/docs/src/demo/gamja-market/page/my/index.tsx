"use client";

import { useEffect } from "react";
import { useOrder } from "@/demo/gamja-market/state/order";
import { TabHeader } from "@/demo/gamja-market/page/shared/tab-header";
import { ProfileCard } from "./profile-card";
import { TradeMenu } from "./trade-menu";
import { RecentOrders } from "./recent-orders";

export default function MyPage() {
  const order = useOrder((state) => ({ actions: state.actions }));
  useEffect(() => {
    order.actions.loadSummary();
  }, [order.actions]);
  return (
    <div className="flex min-h-full flex-col bg-[#FAF8F6] pb-6">
      <TabHeader title="나의당근" />
      <ProfileCard />
      <TradeMenu />
      <RecentOrders />
    </div>
  );
}
