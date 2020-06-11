import { LocationData, ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import {
  filterDatesWithMinConfirmedCases,
  getLocationName,
  getValuesWithActiveCasesRate,
  getValuesWithEMA,
} from "../covid19ApiUtilities";

describe("COVID-19 API utilities", () => {
  const values1: ValuesOnDate = {
    date: "1/23/20",
    confirmed: 10,
    newConfirmed: 10,
    recoveryRate: 0,
    newRecovered: 0,
    mortalityRate: 0,
    activeCases: 10,
    deaths: 0,
    recovered: 0,
    newDeaths: 0,
  };
  const values2: ValuesOnDate = {
    date: "1/24/20",
    confirmed: 100,
    newConfirmed: 90,
    recoveryRate: 0.25,
    newRecovered: 25,
    mortalityRate: 0.25,
    activeCases: 50,
    deaths: 25,
    recovered: 25,
    newDeaths: 25,
  };

  describe("filterDatesWithMinConfirmedCases", () => {
    it("filters out the data before the confirmed cases exceeded the given number", () => {
      const locationData: LocationData = {
        location: "",
        latitude: "",
        longitude: "",
        countryOrRegion: "",
        values: [values1, values2],
      };

      const { values: result } = filterDatesWithMinConfirmedCases(locationData, 10);

      expect(result).toHaveLength(1);
      expect(result).toContain(values2);
      expect(result).not.toContain(values1);
    });
  });

  describe("getValuesWithEMA", () => {
    it("adds exponential moving average to the data", () => {
      const result = getValuesWithEMA([values1, values2], "confirmed", 1);

      expect(result[0].movingAverage).toBeNull();
      expect(result[1].movingAverage).toEqual(10);
    });
  });

  describe("getValuesWithActiveCasesRate", () => {
    it("adds active cases rate to the data", () => {
      const result = getValuesWithActiveCasesRate([values1, values2]);

      expect(result[0].activeCasesRate).toEqual(1);
      expect(result[1].activeCasesRate).toEqual(0.5);
    });

    it("returns `null` values when active case rate cannot be computed", () => {
      const values = { ...values1, recovered: null, recoveryRate: null };

      const result = getValuesWithActiveCasesRate([values]);

      expect(result[0].activeCasesRate).toBeNull();
    });
  });

  describe("getLocationName", () => {
    const country = "USA";
    const state = "Alabama";
    const county = "Autauga";

    it("handles only a country", () => {
      const result = getLocationName(country);

      expect(result).toEqual(country);
    });

    it("handles a country and a state", () => {
      const result = getLocationName(country, state);

      expect(result).toEqual(`${country} (${state})`);
    });

    it("handles a country, a state and a county", () => {
      const result = getLocationName(country, state, county);

      expect(result).toEqual(`${country} (${county}, ${state})`);
    });
  });
});
