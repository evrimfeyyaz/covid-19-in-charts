/**
 * Returns `true` if the given arrays have the same elements, `false` if not.
 *
 * Uses the default comparison function.
 */
export function hasSameElements<T>(arr1: readonly T[], arr2: readonly T[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  const sortedArr1 = [...arr1].sort();
  const sortedArr2 = [...arr2].sort();

  return !sortedArr1.some((el, index) => el !== sortedArr2[index]);
}

/**
 * Returns an array containing the elements of the given array without the `null`s and `undefined`s.
 */
export function filterOnlyNonNull<T>(array: readonly (T | null)[]): T[] {
  return array.filter((el) => el != null) as T[];
}
