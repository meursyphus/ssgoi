import { router } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Fade() {
  return (
    <View
      style={{
        flex: 1,
        padding: 24,
        justifyContent: "center",
        gap: 24,
        backgroundColor: "#c7fa73",
      }}
    >
      <Text style={{ fontSize: 44, fontWeight: "700", color: "#101820" }}>
        Same physics. Native playback.
      </Text>
      <Text style={{ fontSize: 18 }}>
        The outgoing page fades out before this page fades in, using SSGOI's
        double-spring timeline.
      </Text>
      <Button
        title="Back to stories"
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace("/posts")
        }
      />
    </View>
  );
}
