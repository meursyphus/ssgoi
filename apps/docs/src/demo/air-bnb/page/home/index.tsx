"use client";

import { useEffect } from "react";
import { useListing } from "@/demo/air-bnb/state/listing";
import { HomeHeader } from "./header";
import { CategoryTabs } from "./category-tabs";
import { CompanyNotice } from "./company-notice";
import { ListingRow } from "./listing-row";
import { PopularSection } from "./popular-section";
export default function HomePage() {
  const listing = useListing((state) => ({
    feed: state.feed,
    actions: state.actions,
  }));
  useEffect(() => {
    listing.actions.loadFeed();
  }, [listing.actions]);
  return (
    <div
      data-ssgoi-transition="/demo/air-bnb"
      className="flex min-h-full flex-col bg-white"
    >
      <HomeHeader />
      <CategoryTabs />
      <div className="flex-1 pb-6">
        <CompanyNotice />
        <ListingRow
          title="Recently viewed"
          listings={listing.feed.data.recent}
          loading={listing.feed.isLoading}
        />
        <PopularSection
          listings={listing.feed.data.popular}
          loading={listing.feed.isLoading}
        />
      </div>
    </div>
  );
}
