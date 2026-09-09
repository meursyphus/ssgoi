// Expo supplies the native module mocks; the integration tests still use its real router.
jest.mock("react-native-worklets", () => ({
  ...require("react-native-worklets/src/mock"),
  scheduleOnRN: (callback: (...args: unknown[]) => void, ...args: unknown[]) =>
    callback(...args),
}));
import "expo-router/testing-library";
import { AccessibilityInfo } from "react-native";
import { useTestFrameCallback, useTestSharedValue } from "./frame-clock";
jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockResolvedValue(false);

// The upstream Reanimated mock does not implement useFrameCallback and recreates shared values.
const reanimated = require("react-native-reanimated");
reanimated.useFrameCallback = useTestFrameCallback;
reanimated.useSharedValue = useTestSharedValue;
