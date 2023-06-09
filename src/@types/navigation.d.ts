import { productProps } from "../screens/RegisterProduct";

export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      Home: undefined;
      Login: undefined;
      ProductList: undefined;
      RegisterProduct: undefined;
      CheckList: undefined;
      ProductScreen: productProps;
      Settings: undefined;
      AppScreens: undefined;
    }
  }
}
