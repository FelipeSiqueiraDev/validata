import { StatusBar } from "expo-status-bar";
import { AppProvider } from "./src/contexts/auth";
import { NavigationContainer } from "@react-navigation/native";

import Toast from "react-native-toast-message";

import Routes from "./src/routes";

export default function App() {
  return (
    <>
      <NavigationContainer>
        <StatusBar backgroundColor="transparent" translucent />
        <AppProvider>
          <Routes />
        </AppProvider>
      </NavigationContainer>
      <Toast />
    </>
  );
}
