declare module "exponential-moving-average" {
  interface Options {
    /**
     * The number of array elements to use for the moving average. If no number is specified half
     * of the length of the array is used.
     */
    range: number;
    /**
     * Format the numbers as they're added to the result.
     * @param num
     */
    format: (num: number) => string;
  }

  /**
   * Calculate an exponential moving average from an array of numbers.
   * @param arr
   * @param options Options may be passed as an object or as a number to specify only the range to
   *   use.
   */
  export default function ema(arr: number[], options?: Options | number): number[];
}
