import { SingleLocationSectionProps } from "./SingleLocationSectionProps";

export interface SingleLocationSectionWithEmaProps extends SingleLocationSectionProps {
  /**
   * The range of the exponential moving average calculation.
   *
   * For example, settings this to 12 would mean calculating a 12-day exponential moving average.
   */
  emaRange: number;
}
