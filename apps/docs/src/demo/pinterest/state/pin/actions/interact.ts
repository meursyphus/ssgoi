import { action } from "comwit";
import { toast } from "sonner";
import { pin } from "../model";
import type { PinActions, SavedView } from "../types";

export const interactActions = action<
  Pick<PinActions, "setSavedView" | "toggleSave" | "readUpdates">
>(({ state }) => {
  class InteractActions {
    private model = state(pin);

    setSavedView(view: SavedView) {
      this.model.savedView = view;
    }

    toggleSave() {
      const current = this.model.currentPin;
      if (!current) return;
      const saved = this.model.saved.data;
      const listed = saved.some((item) => item.id === current.id);
      const unsavedAt = this.model.unsavedIds.indexOf(current.id);
      if (listed && unsavedAt < 0) {
        this.model.unsavedIds.push(current.id);
        toast("저장을 취소했어요", { duration: 1500 });
        return;
      }
      if (unsavedAt >= 0) this.model.unsavedIds.splice(unsavedAt, 1);
      if (!listed) {
        const { description, tags, domain, ...item } = current;
        void description;
        void tags;
        void domain;
        this.model.saved.set([item, ...saved]);
      }
      toast("프로필에 저장했어요", { duration: 1500 });
    }

    readUpdates() {
      this.model.hasUnreadUpdates = false;
    }
  }
  return new InteractActions();
});
