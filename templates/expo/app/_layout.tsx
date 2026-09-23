import { Ssgoi, type SsgoiConfig } from "@ssgoi/react-native";
import { SsgoiRouteBoundary } from "@ssgoi/react-native/expo-router";
import { fade, slide } from "@ssgoi/react-native/view-transitions";
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
