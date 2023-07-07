import AppScreens from "./AppScreens.routes";
import ProductScreen from "../screens/ProductScreen";
import { AppSettingsProvider } from "../contexts/settings";
import { createStackNavigator } from "@react-navigation/stack";
import FiltersRoutes from "./Filters.Routes";
import FollowupPage from "../screens/FollowupPage";

const { Navigator, Screen } = createStackNavigator();

export default function ProductRoutes() {
  return (
    <AppSettingsProvider>
      <Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="AppScreens"
      >
        <Screen name="AppScreens" component={AppScreens} />
        <Screen name="ProductScreen" component={ProductScreen} />
        <Screen name="FiltersRoutes" component={FiltersRoutes} />
        <Screen name="FollowupPage" component={FollowupPage} />
      </Navigator>
    </AppSettingsProvider>
  );
}
