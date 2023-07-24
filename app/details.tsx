import { View, Text } from "react-native";
import { Stack, useSearchParams, useRouter } from "expo-router";

export default function Details() {
  const router = useRouter();
  const params = useSearchParams();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Stack.Screen
        options={{
          title: params.name,
        }}
      />
      <Text
        onPress={() => {
          router.setParams({ name: "Updated" });
        }}
      >
        Update the title
      </Text>
    </View>
  );
}
