import { numToGroupedString, numToPercentFactory } from "../numUtilities";

describe("Number utilities", () => {
  describe("numToGroupedString", () => {
    it("returns the given number grouped by thousands", () => {
      const oneMillion = 1000000;

      const result = numToGroupedString(oneMillion);

      expect(result).toEqual("1,000,000");
    });
  });

  describe("numToPercentFactory", () => {
    it("returns a function that returns a number as percentage with the given decimal points", () => {
      const result = numToPercentFactory(2);

      expect(result(0.0123)).toEqual("1.23%");
    });
  });
});
