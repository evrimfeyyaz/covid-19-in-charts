import { deleteDB } from "idb";

/**
 * Cleans up artifacts from the earlier versions of the app.
 */
export function cleanUp(): void {
  // Delete the user settings from before 0.15.6.
  localStorage.removeItem("dataByLocationJson");
  localStorage.removeItem("lastUpdatedTimeStr");
  localStorage.removeItem("localDataExpirationTimeStr");
  localStorage.removeItem("version");

  // Delete the user settings from before 0.16.2.
  localStorage.removeItem("covid19DataStoreExpiresAt");
  localStorage.removeItem("covid19DataStoreLastUpdatedAt");
  localStorage.removeItem("covid19DataStoreData");
  localStorage.removeItem("covid19DataStoreVersion");

  // Update the user settings from before 0.18.0.
  localStorage.removeItem("casesRecoveriesDeathsLastLocation");
  localStorage.removeItem("caseRecoveriesLastExceedingValue");
  localStorage.removeItem("caseRecoveriesLastExceedingProperty");
  localStorage.removeItem("dailyNumbersLastLocation");
  localStorage.removeItem("locationComparisonLastExceedingProperty");
  localStorage.removeItem("locationComparisonLastExceedingValue");
  localStorage.removeItem("locationComparisonLastLocations");
  localStorage.removeItem("locationComparisonLastProperty");
  deleteDB("Covid19DataStoreDb").catch(console.error);
}
