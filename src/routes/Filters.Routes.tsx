import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import FilterDate from "../screens/FilterDate";
import FilterList from "../screens/FilterList";

const { Navigator, Screen } = createMaterialTopTabNavigator();

export default function FiltersRoutes() {
  return (
    <Navigator
      style={{ paddingTop: 20 }}
      screenOptions={{
        tabBarPressColor: "#FFF",
        tabBarInactiveTintColor: "#A1A1A1",
        tabBarActiveTintColor: "#FFF",
        tabBarIndicatorStyle: { backgroundColor: "#FFF" },
        tabBarStyle: { backgroundColor: "#ECA400" },
      }}
    >
      <Screen
        name="FilterList"
        component={FilterList}
        options={{ tabBarLabel: "Seção" }}
      />
      <Screen
        name="FilterDate"
        component={FilterDate}
        options={{ tabBarLabel: "Data" }}
      />
    </Navigator>
  );
}
