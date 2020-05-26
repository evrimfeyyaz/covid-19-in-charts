import { deleteDB } from "idb";

export async function removeOldIndexedDB(): Promise<void> {
  await deleteDB("Covid19DataStoreDb");
}
