import { Link } from "expo-router";
import { ScrollView, Text, View } from "react-native";

export default function Posts() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#101820" }}
      contentContainerStyle={{ padding: 24, gap: 16 }}
    >
      <Text style={{ color: "#c7fa73", fontSize: 14 }}>
        SSGOI / REACT NATIVE
      </Text>
      <Text style={{ color: "white", fontSize: 36, fontWeight: "700" }}>
        Pick a story.
      </Text>
      <Text style={{ color: "#bec6ce", fontSize: 16 }}>
        Scroll down, open a story, and go back. This list stays mounted while
        the detail screen slides in.
      </Text>
      <Link href="/fade" style={{ color: "#c7fa73", paddingVertical: 16 }}>
        Try the fade transition →
      </Link>
      {Array.from({ length: 20 }, (_, i) => (
        <Link
          key={i}
          href={{ pathname: "/posts/[id]", params: { id: String(i + 1) } }}
          asChild
        >
          <Text
            accessibilityRole="link"
            style={{
              padding: 24,
              borderRadius: 16,
              backgroundColor: "#22313e",
              color: "white",
              fontSize: 20,
            }}
          >
            Story {i + 1} →
          </Text>
        </Link>
      ))}
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}
