import * as SecureStore from "expo-secure-store";
import { SELECTED_FILTER } from "../storageConfig";

export default async function deleteFilterCredentials() {
  try {
    await SecureStore.deleteItemAsync(SELECTED_FILTER);
  } catch (err) {
    throw err;
  }
}
