import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import React, { FunctionComponent } from "react";
import { COLORS } from "../../../../constants";
import {
  getFormattedValuesOnDate,
  pluralizeProperty,
} from "../../../../utilities/covid19ApiUtilities";

interface LatestValuesMessageProps {
  /**
   * The latest values.
   */
  latestValues: ValuesOnDate;
  /**
   * The property to use in this message, e.g. `confirmedCases`.
   */
  property: keyof Omit<ValuesOnDate, "date" | "mortalityRate" | "recoveryRate">;
}

/**
 * A component that shows and explains the latest value of a property.
 *
 * @param latestValues All the latest values.
 * @param property The `ValuesOnDate` property to explain.
 */
export const LatestValuesMessage: FunctionComponent<LatestValuesMessageProps> = ({
  latestValues,
  property,
}) => {
  const formattedValues = getFormattedValuesOnDate(latestValues);
  const latestValue = latestValues[property];

  let color: string;
  switch (property) {
    case "confirmed":
    case "newConfirmed":
      color = COLORS.confirmed;
      break;
    case "deaths":
    case "newDeaths":
      color = COLORS.deaths;
      break;
    case "recovered":
    case "newRecovered":
      color = COLORS.recovered;
      break;
    default:
      color = "#000";
  }

  if (latestValue == null) {
    return null;
  }

  const isCumulative =
    property === "confirmed" || property === "deaths" || property === "recovered";

  return (
    <p>
      There {latestValue === 1 ? "was" : "were"}{" "}
      <span style={{ color }}>
        {formattedValues[property]} {pluralizeProperty(property, latestValue)}
      </span>{" "}
      {isCumulative && "to date"} on {formattedValues.date}.
    </p>
  );
};
