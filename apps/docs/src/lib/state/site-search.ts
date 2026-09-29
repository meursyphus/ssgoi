import { action, create, model } from "comwit";

type SiteSearchState = {
  open: boolean;
  /** Text the palette opens with; the palette owns the query after that. */
  initialQuery: string;
};

type SiteSearchActions = {
  open(query?: string): void;
  close(): void;
  toggle(): void;
};

const siteSearch = model<SiteSearchState>({ open: false, initialQuery: "" });

const openActions = action<SiteSearchActions>(({ state }) => {
  class OpenActions {
    private model = state(siteSearch);
    open(query = "") {
      this.model.initialQuery = query;
      this.model.open = true;
    }
    close() {
      this.model.open = false;
    }
    toggle() {
      if (!this.model.open) this.model.initialQuery = "";
      this.model.open = !this.model.open;
    }
  }
  return new OpenActions();
});

/** The ⌘K palette: shared by the nav buttons, the catalog and the hotkeys. */
export const useSiteSearch = create<SiteSearchState, SiteSearchActions>(
  siteSearch,
  { actions: [openActions] },
);
