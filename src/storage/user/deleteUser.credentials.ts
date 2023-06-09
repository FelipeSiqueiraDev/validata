import * as SecureStore from "expo-secure-store";
import { USER_CREDENTIALS } from "../storageConfig";

export default async function deleteUserCredentials() {
  try {
    await SecureStore.deleteItemAsync(USER_CREDENTIALS);
  } catch (err) {
    throw err;
  }
}
