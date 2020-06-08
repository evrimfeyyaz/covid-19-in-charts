import { getAliasesForLocation } from "../countryUtilities";

describe("Country utilities", () => {
  describe("getAliasesForLocation", () => {
    it("it returns aliases given a string that contains the name of a location with aliases", () => {
      const location = "US (Autauga, Alabama)";

      const result = getAliasesForLocation(location);
      const expected = ["United States of America", "USA", "United States", "America", "States"];

      expect(result).toEqual(expected);
    });

    it("returns aliases for the United States of America", () => {
      const result = getAliasesForLocation("US");

      expect(result.length).toBeGreaterThanOrEqual(1);
    });

    it("returns aliases for South Korea", () => {
      const result = getAliasesForLocation("Korea, South");

      expect(result.length).toBeGreaterThanOrEqual(1);
    });

    it("returns aliases for the United Kingdom", () => {
      const result = getAliasesForLocation("United Kingdom");

      expect(result.length).toBeGreaterThanOrEqual(1);
    });

    it("returns aliases for China", () => {
      const result = getAliasesForLocation("China");

      expect(result.length).toBeGreaterThanOrEqual(1);
    });

    it("returns aliases for Czechia", () => {
      const result = getAliasesForLocation("Czechia");

      expect(result.length).toBeGreaterThanOrEqual(1);
    });

    it("returns aliases for the United Arab Emirates", () => {
      const result = getAliasesForLocation("United Arab Emirates");

      expect(result.length).toBeGreaterThanOrEqual(1);
    });

    it("returns an empty array when there are no aliases for the given location", () => {
      const result = getAliasesForLocation("Location with no alias");

      expect(result).toEqual([]);
    });
  });
});
