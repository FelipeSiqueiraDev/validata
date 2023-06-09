import * as SecureStore from "expo-secure-store";
import { SELECTED_FILTER } from "../storageConfig";
import { filterProps } from "../../components/FilterModal";

export default async function getFilterCredentials() {
  try {
    const selectedFilter = await SecureStore.getItemAsync(SELECTED_FILTER);
    const filterData: filterProps = selectedFilter
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
