import { dateKeyToDate, getFormattedDate } from "../dateUtilities";

describe("Date utilities", () => {
  describe("dateKeyToDate", () => {
    it("returns a Date object with the same date as the given date key", () => {
      const key1 = "1/11/20";
      const key2 = "11/1/20";

      const result1 = dateKeyToDate(key1);
      const result2 = dateKeyToDate(key2);

      expect(result1.getFullYear()).toEqual(2020);
      expect(result1.getMonth()).toEqual(0);
      expect(result1.getDate()).toEqual(11);
      expect(result2.getFullYear()).toEqual(2020);
      expect(result2.getMonth()).toEqual(10);
      expect(result2.getDate()).toEqual(1);
    });

    it("throws an error when the given string has the wrong format", () => {
      const wrongKey = "wrong";

      expect(() => dateKeyToDate(wrongKey)).toThrow();
    });
  });

  describe("getFormattedDate", () => {
    it("returns a string with a more readable date format", () => {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      months.forEach((month, index) => {
        const date = new Date(2020, index, 1);
        const result = getFormattedDate(date);

        expect(result).toEqual(`${month} 1, 2020`);
      });
    });
  });
});
