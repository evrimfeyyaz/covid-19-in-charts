import { COVID19APIOptions, LocationData, ValuesOnDate } from "@evrimfeyyaz/covid-19-api";

/**
 * Creates test `LocationData` to be used in integration tests. Can only generate country data (no
 * state or county data).
 *
 * @param location The name of the location.
 * @param hasRecovered Whether recoveries data should be included. Some locations lack the
 *   recoveries information, so this can be set to `false` to simulate them.
 */
function createTestLocationData(location: string, hasRecovered = true): LocationData {
  const values: ValuesOnDate[] = [];

  let previousConfirmed = 0;
  let previousDeaths = 0;
  let previousRecovered = 0;
  for (let i = 0; i < 20; i++) {
    const confirmed = 100 * i;
    const deaths = confirmed - 100;
    const recovered = confirmed - 100;
    const newConfirmed = confirmed - previousConfirmed;
    const newDeaths = deaths - previousDeaths;
    const newRecovered = recovered - previousRecovered;
    const caseFatalityRate = deaths / confirmed;
    const recoveryRate = recovered / confirmed;
    const activeCases = confirmed - recovered - deaths;
    const date = `1/${i}/20`;

    const valuesOnDate: ValuesOnDate = {
      confirmed,
      newConfirmed,
      deaths,
      newDeaths,
      recovered: hasRecovered ? recovered : null,
      newRecovered: hasRecovered ? newRecovered : null,
      caseFatalityRate,
      recoveryRate: hasRecovered ? recoveryRate : null,
      activeCases: hasRecovered ? activeCases : null,
      date,
    };

    values.push(valuesOnDate);

    previousConfirmed = confirmed;
    previousDeaths = deaths;
    previousRecovered = recovered;
  }

  return {
    location,
    countryOrRegion: location,
    latitude: "",
    longitude: "",
    values,
  };
}

const mockLocationData: LocationData[] = [
  createTestLocationData("Turkey"),
  createTestLocationData("US"),
  createTestLocationData("NoRecoveriesistan", false),
  { ...createTestLocationData("NoData Republic"), values: [] },
  createTestLocationData("United Kingdom"),
  createTestLocationData("Netherlands"),
  createTestLocationData("Sweden"),
];

export const COVID19API = jest.fn().mockImplementation((options?: COVID19APIOptions) => {
  options?.onLoadingStatusChange?.(false);

  return {
    init: jest.fn().mockImplementation(() => Promise.resolve()),
    getDataByLocation: jest.fn().mockImplementation((location: string) => {
      const locationData = mockLocationData.find((data) => data.location === location);

      return Promise.resolve(locationData);
    }),
    locations: mockLocationData.map((data) => data.location),
    sourceLastUpdatedAt: new Date(),
  };
});
