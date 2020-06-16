/* eslint-disable @typescript-eslint/no-empty-function */
// Based on https://github.com/popperjs/popper-core/issues/478#issuecomment-638842453

import StockPopperJs from "popper.js";

export default class PopperJs {
  static placements = StockPopperJs.placements;

  constructor() {
    return {
      destroy: (): void => {},
      scheduleUpdate: (): void => {},
      update: (): void => {},
    };
  }
}
