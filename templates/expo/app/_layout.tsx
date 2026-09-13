import { Ssgoi, type SsgoiConfig } from "@ssgoi/expo-router";
import { SsgoiRouteBoundary } from "@ssgoi/expo-router";
import { fade, slide } from "@ssgoi/expo-router/view-transitions";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const config = {
  transitions: [
    { on: "/posts/*", transition: slide() },
    { on: "/fade", transition: fade() },
  ],
} satisfies SsgoiConfig;

export default function Layout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#101820" }}>
        <Ssgoi config={config}>
          <SsgoiRouteBoundary />
        </Ssgoi>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
