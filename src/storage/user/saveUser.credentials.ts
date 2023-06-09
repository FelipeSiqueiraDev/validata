import * as SecureStore from "expo-secure-store";
import { USER_CREDENTIALS } from "../storageConfig";
import { userProps } from "../../screens/Login";

export default async function saveUserCredentials(credentials: userProps) {
  try {
    await SecureStore.setItemAsync(
      USER_CREDENTIALS,
      JSON.stringify(credentials)
    );
  } catch (err) {
    throw err;
  }
}
