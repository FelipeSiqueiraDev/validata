import * as SecureStore from "expo-secure-store";
import { DATA_FILTER } from "../storageConfig";

export type filterDateProps = {
  initialDate: string;
  finalDate: string;
  periodName: string;
};

export default async function saveDateFilterCredentials({
  initialDate,
  finalDate,
  periodName,
}: filterDateProps) {
  try {
    await SecureStore.setItemAsync(
      DATA_FILTER,
      JSON.stringify({ initialDate, finalDate, periodName })
    );
  } catch (err) {
    throw err;
  }
}
