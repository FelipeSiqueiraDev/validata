import * as SecureStore from "expo-secure-store";
import { companyProps } from "../../screens/Settings";
import { COMPANY_CREDENTIALS } from "../storageConfig";

export default async function saveCompanyCredentials(credentials: companyProps) {
  try {
    await SecureStore.setItemAsync(
      COMPANY_CREDENTIALS,
      JSON.stringify(credentials)
    );
  } catch (err) {
    throw err;
  }
}
