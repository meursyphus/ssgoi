import { action, OnError } from "comwit";
import { toast } from "sonner";
import { pin as pinAPI } from "@/demo/pinterest/api/pin";
import { pin } from "../model";
import type { PinActions } from "../types";

export const searchActions = action<Pick<PinActions, "search">>(({ state }) => {
  class SearchActions {
    private model = state(pin);

    @OnError((e: unknown) => {
      toast.error(
        e instanceof Error ? e.message : "검색 결과를 불러오지 못했습니다",
      );
    })
    async search(query: string) {
      this.model.searchQuery = query;
      this.model.isSearching = true;
      try {
        const results = await pinAPI.search(query);
        this.model.searchResults = results;
      } finally {
        this.model.isSearching = false;
      }
    }
  }
  return new SearchActions();
});
