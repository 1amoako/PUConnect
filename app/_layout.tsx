import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "../context/ThemeContext";
import { UserProvider } from "../context/UserContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <UserProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }} />
      </UserProvider>
    </ThemeProvider>
  );
}
