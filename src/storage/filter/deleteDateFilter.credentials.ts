import * as SecureStore from "expo-secure-store";
import { DATA_FILTER } from "../storageConfig";

export default async function deleteDateFilterCredentials() {
  try {
    await SecureStore.deleteItemAsync(DATA_FILTER);
  } catch (err) {
    throw err;
  }
}
