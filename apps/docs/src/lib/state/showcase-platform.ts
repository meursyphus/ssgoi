import { action, create, model } from "comwit";

export type ShowcasePlatform = "mobile" | "web";

type PlatformState = { value: ShowcasePlatform };
type PlatformActions = { set(next: ShowcasePlatform): void };

const showcasePlatform = model<PlatformState>({ value: "mobile" });

const setActions = action<PlatformActions>(({ state }) => {
  class SetActions {
    private model = state(showcasePlatform);
    set(next: ShowcasePlatform) {
      this.model.value = next;
    }
  }
  return new SetActions();
});

export const useShowcasePlatform = create<PlatformState, PlatformActions>(
  showcasePlatform,
  { actions: [setActions] },
);
