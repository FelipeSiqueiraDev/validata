import * as SecureStore from "expo-secure-store";
import { DATA_FILTER } from "../storageConfig";
import { filterDateProps } from "./saveDateFilter.credentials";

export default async function getDateFilterCredentials() {
  try {
    const selectedFilter = await SecureStore.getItemAsync(DATA_FILTER);
    const filterData: filterDateProps = selectedFilter
      ? JSON.parse(selectedFilter)
      : undefined;

    if (!filterData) {
      throw filterData;
    }

    return filterData;
  } catch (err) {
    throw err;
  }
}
