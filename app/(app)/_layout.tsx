import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#0B0B0F" },
        headerTitleStyle: { color: "#F4F4F6" },
        headerTintColor: "#7C5CFF",
        contentStyle: { backgroundColor: "#0B0B0F" },
      }}
    >
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen
        name="connect/[platform]"
        options={{
          title: "Connect Platform",
          presentation: "card",
          gestureEnabled: false,
          headerTransparent: true,
          headerStyle: { backgroundColor: "transparent" },
        }}
      />
    </Stack>
  );
}
