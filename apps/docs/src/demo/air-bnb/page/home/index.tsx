"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useListing } from "@/demo/air-bnb/state/listing";
import { HomeHeader } from "./header";
import { CategoryTabs } from "./category-tabs";
import { CompanyNotice } from "./company-notice";
import { ListingRow } from "./listing-row";
import { GridSection } from "./grid-section";
import { FeedSkeleton } from "./feed-skeleton";

export default function HomePage() {
  const listing = useListing((state) => ({
    feed: state.feed,
    vertical: state.vertical,
    actions: state.actions,
  }));
  useEffect(() => {
    listing.actions.loadFeed();
    // Warm the search sheet so its suggestions are there on its first frame.
    listing.actions.searchDestinations("");
  }, [listing.actions]);
  const feed = listing.feed.data;

  return (
    <div className="flex flex-1 flex-col bg-white">
      <HomeHeader />
      <CategoryTabs
        active={listing.vertical}
        onSelect={(vertical) => listing.actions.selectVertical(vertical)}
      />
      <div className="flex-1 pb-6">
        <CompanyNotice />
        {listing.feed.isLoading && feed.sections.length === 0 ? (
          <FeedSkeleton />
        ) : (
          // Category tabs swap the feed in place: a short crossfade, no route.
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={feed.vertical}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
            >
              {feed.sections.map((section) =>
                section.layout === "row" ? (
                  <ListingRow key={section.key} section={section} />
                ) : (
                  <GridSection key={section.key} section={section} />
                ),
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
