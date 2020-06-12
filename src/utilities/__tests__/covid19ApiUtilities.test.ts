import { LocationData, ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import {
  filterDatesWithMinConfirmedCases,
  FormattedValuesOnDate,
  getFormattedValuesOnDate,
  getValuesWithActiveCasesRate,
  getValuesWithEma,
  pluralizeProperty,
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

  describe("getValuesWithEma", () => {
    it("adds exponential moving average to the data", () => {
      const result = getValuesWithEma([values1, values2], "confirmed", 1);

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

  describe("pluralize", () => {
    it('handles "confirmed"', () => {
      const singularResult = pluralizeProperty("confirmed", 1);
      const pluralResult = pluralizeProperty("confirmed", 2);

      expect(singularResult).toEqual("confirmed case");
      expect(pluralResult).toEqual("confirmed cases");
    });

    it('handles "deaths"', () => {
      const singularResult = pluralizeProperty("deaths", 1);
      const pluralResult = pluralizeProperty("deaths", 2);

      expect(singularResult).toEqual("death");
      expect(pluralResult).toEqual("deaths");
    });

    it('handles "recovered"', () => {
      const singularResult = pluralizeProperty("recovered", 1);
      const pluralResult = pluralizeProperty("recovered", 2);

      expect(singularResult).toEqual("recovery");
      expect(pluralResult).toEqual("recoveries");
    });

    it('handles "newConfirmed"', () => {
      const singularResult = pluralizeProperty("newConfirmed", 1);
      const pluralResult = pluralizeProperty("newConfirmed", 2);

      expect(singularResult).toEqual("new case");
      expect(pluralResult).toEqual("new cases");
    });

    it('handles "newDeaths"', () => {
      const singularResult = pluralizeProperty("newDeaths", 1);
      const pluralResult = pluralizeProperty("newDeaths", 2);

      expect(singularResult).toEqual("new death");
      expect(pluralResult).toEqual("new deaths");
    });

    it('handles "newRecovered"', () => {
      const singularResult = pluralizeProperty("newRecovered", 1);
      const pluralResult = pluralizeProperty("newRecovered", 2);

      expect(singularResult).toEqual("new recovery");
      expect(pluralResult).toEqual("new recoveries");
    });

    it('handles "activeCases"', () => {
      const singularResult = pluralizeProperty("activeCases", 1);
      const pluralResult = pluralizeProperty("activeCases", 2);

      expect(singularResult).toEqual("active case");
      expect(pluralResult).toEqual("active cases");
    });
  });

  describe("getFormattedValuesOnDate", () => {
    it("formats all values", () => {
      const values: ValuesOnDate = {
        date: "1/23/20",
        confirmed: 1000000,
        newConfirmed: 1000000,
        recoveryRate: 0.12345,
        newRecovered: 1000000,
        mortalityRate: 0.12345,
        activeCases: 1000000,
        deaths: 1000000,
        recovered: 1000000,
        newDeaths: 1000000,
      };

      const result = getFormattedValuesOnDate(values);
      const expected: FormattedValuesOnDate = {
        date: "January 23, 2020",
        confirmed: "1,000,000",
        newConfirmed: "1,000,000",
        recoveryRate: "12.35%",
        newRecovered: "1,000,000",
        mortalityRate: "12.35%",
        activeCases: "1,000,000",
        deaths: "1,000,000",
        recovered: "1,000,000",
        newDeaths: "1,000,000",
      };

      expect(result).toEqual(expected);
    });
  });
});
