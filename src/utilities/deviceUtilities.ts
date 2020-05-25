// From:
// https://stackoverflow.com/questions/10193294/how-can-i-tell-if-a-browser-supports-input-type-date#comment28536897_10199306
export function isDateInputSupported(): boolean {
  const el = document.createElement("input");
  const notADateValue = "not-a-date";

  el.setAttribute("type", "date");
  el.setAttribute("value", notADateValue);

  return el.value !== notADateValue;
}
