import * as SecureStore from "expo-secure-store";
import { SELECTED_FILTER } from "../storageConfig";
import { filterProps } from "../../components/FilterModal";

export type saveFilterProps ={
  filterId: string,
  filterName: string
}

export default async function saveFilterCredentials(credentials: saveFilterProps) {
  try {
    await SecureStore.setItemAsync(
      SELECTED_FILTER,
      JSON.stringify(credentials)
    );
  } catch (err) {
    throw err;
  }
}
