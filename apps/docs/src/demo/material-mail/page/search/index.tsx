"use client";

import { useEffect } from "react";
import { useMail } from "@/demo/material-mail/state/mail";
import { SearchHeader } from "./search-header";
import { RecentSearches } from "./recent-searches";
import { SearchResults } from "./search-results";

export default function SearchPage() {
  const mail = useMail((s) => ({
    searchQuery: s.searchQuery,
    actions: s.actions,
  }));

  // Coming back from a result: stars or trash may have changed meanwhile.
  useEffect(() => {
    void mail.actions.refreshResults();
  }, [mail.actions]);

  return (
    <div className="flex min-h-full flex-col bg-white">
      <SearchHeader />
      {mail.searchQuery.trim() ? <SearchResults /> : <RecentSearches />}
    </div>
  );
}
