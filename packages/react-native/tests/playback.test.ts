import { act, renderHook } from "@testing-library/react-native";
import { createPageMotionPlan } from "@ssgoi/core/runtime";
import { useNativePlayback } from "../src/playback";
import { advanceFrames } from "./frame-clock";

test("the playback clock reports completion once rather than sending each frame to JS", () => {
  const completed = jest.fn();
  const plan = createPageMotionPlan("fade", "forward");
  const { result, unmount } = renderHook(() =>
    useNativePlayback(17, plan, true, completed),
  );
  act(() => advanceFrames(100, 1000 / 120));
  expect(result.current.value.elapsed).toBeGreaterThan(0);
  expect(completed).not.toHaveBeenCalled();
  act(() => advanceFrames(plan.duration + 1000, 1000 / 120));
  expect(result.current.value.elapsed).toBe(plan.duration);
  expect(result.current.value.running).toBe(false);
  expect(completed.mock.calls).toEqual([[17]]);
  unmount();
});
