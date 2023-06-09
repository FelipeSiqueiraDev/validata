import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "../screens/Home";
import Login from "../screens/Login";
import AppScreens from "./AppScreens.routes";
import ProductScreen from "../screens/ProductScreen";

const { Navigator, Screen } = createNativeStackNavigator();

export default function InitialScreens() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="Home" component={Home} />
      <Screen name="Login" component={Login} />
    </Navigator>
  );
}
