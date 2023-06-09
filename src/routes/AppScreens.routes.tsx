import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import ProductList from "../screens/ProductList";
import RegisterProduct from "../screens/RegisterProduct";
import CheckList from "../screens/CheckList";
import Settings from "../screens/Settings";

import { AntDesign } from "@expo/vector-icons";
import { useContext } from "react";
import { AppSettingsContext } from "../contexts/settings";

import { ActivityIndicator } from "react-native";

const { Navigator, Screen } = createBottomTabNavigator();

export default function AppScreens() {
  const { isLoading } = useContext(AppSettingsContext);

  if (isLoading) {
    return <ActivityIndicator animating={true} color={"#ECA400"} />;
  }
  return (
    <Navigator
      initialRouteName="ProductList"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        unmountOnBlur: true,
      }}
    >
      <Screen
        name="ProductList"
        component={ProductList}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <AntDesign name="form" size={20} color={"#ECA400"} />
            ) : (
              <AntDesign name="form" size={20} color={"#A1A1A1"} />
            ),
        }}
      />

      <Screen
        name="RegisterProduct"
        component={RegisterProduct}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <AntDesign name="plus" size={20} color={"#ECA400"} />
            ) : (
              <AntDesign name="plus" size={20} color={"#A1A1A1"} />
            ),
        }}
      />

      <Screen
        name="CheckList"
        component={CheckList}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <AntDesign name="check" size={20} color={"#ECA400"} />
            ) : (
              <AntDesign name="check" size={20} color={"#A1A1A1"} />
            ),
        }}
      />

      <Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <AntDesign name="setting" size={20} color={"#ECA400"} />
            ) : (
              <AntDesign name="setting" size={20} color={"#A1A1A1"} />
            ),
        }}
      />
    </Navigator>
  );
}
