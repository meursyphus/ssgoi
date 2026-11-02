import { StackRouter, unstable_integrateWithRouter } from "expo-router";
import {
  Ssgoi,
  SsgoiLayoutBoundary,
  type SsgoiConfig,
} from "@ssgoi/react-native";
import { fade, slide } from "@ssgoi/react-native/view-transitions";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const config = {
  transitions: [
    { on: "/posts/*", transition: slide() },
    { on: "/fade", transition: fade() },
  ],
} satisfies SsgoiConfig;

const framework = { StackRouter, unstable_integrateWithRouter };

export default function Layout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#101820" }}>
        <Ssgoi config={config} framework={framework}>
          <SsgoiLayoutBoundary />
        </Ssgoi>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
