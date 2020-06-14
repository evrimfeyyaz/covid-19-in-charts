import { filterOnlyNonNull, hasSameElements } from "../arrayUtilities";

describe("Array utilities", () => {
  describe("hasSameElements", () => {
    it("returns `true` when the given arrays have the same elements", () => {
      const arr1 = [1, 2, 3];
      const arr2 = [2, 3, 1];

      const result = hasSameElements(arr1, arr2);

      expect(result).toEqual(true);
    });

    it("returns `false` when the given arrays do not have the same elements", () => {
      const arr1 = [1, 2, 3];
      const arr2 = [1, 2, 4];

      const result = hasSameElements(arr1, arr2);

      expect(result).toEqual(false);
    });

    it("returns `false` when two arrays have different elements, but one is a subset of the other", () => {
      const arr1 = [1, 2, 3];
      const arr2 = [1, 2, 3, 4];

      const result1 = hasSameElements(arr1, arr2);
      const result2 = hasSameElements(arr2, arr1);

      expect(result1).toEqual(false);
      expect(result2).toEqual(false);
    });
  });

  describe("filterOnlyNonNull", () => {
    it("filters out the `null`s and `undefined`s from the given array", () => {
      const arr = [1, 2, 3, null, 4, undefined, 5];

      const result = filterOnlyNonNull(arr);

      expect(result).toEqual([1, 2, 3, 4, 5]);
    });
  });
});
