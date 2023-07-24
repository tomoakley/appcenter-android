import { Stack } from "expo-router"
import { PaperProvider } from "react-native-paper"
import { Provider } from "react-redux"

import { store } from "./store"

export default function Layout() {
  return (
    <Provider store={store}>
      <PaperProvider>
          <Stack
            initialRouteName="home"
            screenOptions={{
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          />
      </PaperProvider>
    </Provider>
  )
}
