import * as SecureStore from "expo-secure-store";
import { USER_CREDENTIALS } from "../storageConfig";
import { userProps } from "../../screens/Login";

export default async function getUserCredentials() {
  try {
    const userCredential = await SecureStore.getItemAsync(USER_CREDENTIALS);
    const userData: userProps = userCredential
      ? JSON.parse(userCredential)
      : undefined;

    if (!userData) {
      throw userData;
    }

    return userData;
  } catch (err) {
    throw err;
  }
}
