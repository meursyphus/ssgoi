import { action, OnError } from "comwit";
import { toast } from "sonner";
import { story as storyAPI } from "@/demo/voyage/api/story";
import { story } from "../model";
import type { StoryActions } from "../types";

/** Long enough for the zoom back into a Saved card to finish first. */
const SAVED_REFRESH_DELAY_MS = 700;

export const interactActions = action<
  Pick<
    StoryActions,
    "toggleSave" | "enterSavedTab" | "leaveSavedTab" | "readActivity"
  >
>(({ state }) => {
  class InteractActions {
    private model = state(story);
    private refreshTimer: ReturnType<typeof setTimeout> | null = null;

    @OnError((e: unknown) => {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    })
    async toggleSave(id: string) {
      const { saved } = await storyAPI.toggleSave(id);
      // Replace rather than mutate: seeded rows come from frozen server props.
      const mark = <T extends { id: string; saved: boolean }>(row: T) =>
        row.id === id ? { ...row, saved } : row;
      if (this.model.current?.id === id) {
        this.model.current = mark(this.model.current);
      }
      if (this.model.stories.isSuccess) {
        this.model.stories.set(this.model.stories.data.map(mark));
      }

      // A story un-saved from the reader keeps its Saved card (un-filled)
      // until the tab has opened again, so Back can still zoom into it.
      // Once a removal is pending, later toggles wait for the same refresh,
      // or they would drop that card before the zoom back reaches it.
      const deferRefresh =
        !this.model.savedTabOpen &&
        this.model.savedStories.isSuccess &&
        (this.model.savedNeedsRefresh ||
          (!saved && this.model.savedStories.data.some((s) => s.id === id)));
      if (deferRefresh) {
        this.model.savedStories.set(this.model.savedStories.data.map(mark));
        this.model.savedNeedsRefresh = true;
      }
      await Promise.all([
        this.model.stories.query({ force: true }),
        deferRefresh
          ? Promise.resolve()
          : this.model.savedStories.query({ force: true }),
      ]);
    }

    enterSavedTab() {
      this.model.savedTabOpen = true;
      if (!this.model.savedNeedsRefresh) return;
      this.refreshTimer = setTimeout(() => {
        this.refreshTimer = null;
        this.model.savedNeedsRefresh = false;
        void this.model.savedStories.query({ force: true });
      }, SAVED_REFRESH_DELAY_MS);
    }

    leaveSavedTab() {
      this.model.savedTabOpen = false;
      if (this.refreshTimer) clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }

    readActivity() {
      this.model.hasUnreadActivity = false;
    }
  }
  return new InteractActions();
});
