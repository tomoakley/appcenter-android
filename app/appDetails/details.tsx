import { View, Text, Alert } from "react-native";
import { Stack, useSearchParams, useRouter, usePathname } from "expo-router";
import { useGetReleasesQuery } from "../slices/apps";
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { useEffect } from "react";

export default function Details() {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const orgName = useAppSelector(state => state.auth.orgName)
  const appName = params.app?.name
  const {data} = useGetReleasesQuery({orgName, appName})
  useEffect(() => {
    Alert.alert('app params', JSON.stringify(params))
  }, [])

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Stack.Screen
        options={{
          title: params.app.name,
        }}
      />
      <Text
        onPress={() => {
          router.setParams({ name: "Updated" });
        }}
      >
        Hello, Update the {pathname}
      </Text>
      <Text>{data ? JSON.stringify(data) : 'none found'}</Text>
    </View>
  );
}
