import * as SecureStore from "expo-secure-store";
import { COMPANY_CREDENTIALS } from "../storageConfig";
import { companyProps } from "../../screens/Settings";

export default async function getCompanyCredentials() {
  try {
    const companyCredential = await SecureStore.getItemAsync(
      COMPANY_CREDENTIALS
    );
    const companyData: companyProps = companyCredential
      ? JSON.parse(companyCredential)
      : undefined;

    return companyData;
  } catch (err) {
    throw err;
  }
}
