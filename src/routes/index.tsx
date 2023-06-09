import { NavigationContainer } from "@react-navigation/native";

import AppScreens from "./AppScreens.routes";
import InitialScreens from "./InitialScreens.routes";

import { useContext } from "react";
import { AuthContext } from "../contexts/auth";
import ProductRoutes from "./Product.routes";

export default function Routes() {
  const { logged } = useContext(AuthContext);
  return <>{logged ? <ProductRoutes /> : <InitialScreens />}</>;
}
