import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Button, Text, TextInput, View } from "react-native";

export default function Story() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [note, setNote] = useState("");
  const next = String(Number(id) + 1);
  return (
    <View style={{ flex: 1, padding: 24, gap: 20, backgroundColor: "#f3f3e9" }}>
      <Button
        title="← Back"
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace("/posts")
        }
      />
      <Text style={{ fontSize: 40, fontWeight: "700", color: "#101820" }}>
        Story {id}
      </Text>
      <Text style={{ fontSize: 18 }}>
        Write a note, push another story, then go back. The note belongs to this
        screen instance.
      </Text>
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="A note for this story"
        style={{
          padding: 18,
          borderWidth: 1,
          borderColor: "#8b9b90",
          borderRadius: 12,
        }}
      />
      <Button
        title="Push next story"
        onPress={() =>
          router.push({ pathname: "/posts/[id]", params: { id: next } })
        }
      />
      <Button
        title="Replace with next story"
        onPress={() =>
          router.replace({ pathname: "/posts/[id]", params: { id: next } })
        }
      />
    </View>
  );
}
