import React, { FunctionComponent } from "react";
import Card from "react-bootstrap/Card";
import { numToGroupedString, numToPercentFactory } from "../../../../utilities/numUtilities";

interface LatestNumbersItemProps {
  /**
   * The name of the value, e.g. "Confirmed Cases".
   */
  title: string;
  /**
   * The latest value.
   */
  value: number | null;
  /**
   * The color of the header.
   */
  color: string;
  /**
   * The increase of the data point compared to the last date. For example, if this item is showing
   * "confirmed cases," this value would should be set to "new confirmed cases".
   */
  newValue?: number | null;
  /**
   * The value as the percentage of confirmed cases.
   */
  rateValue?: number | null;
  /**
   * Extra information to show in the footer.
   */
  footerInformation?: JSX.Element;
}

/**
 * A single item within the {@link SingleLocationLatestNumbers} component, showing a value such as
 * "confirmed cases," and other information.
 */
export const SingleLocationLatestNumbersItem: FunctionComponent<LatestNumbersItemProps> = ({
  color,
  title,
  value,
  rateValue,
  newValue,
  footerInformation,
}) => {
  const valueStr = value != null ? numToGroupedString(value) : "No Data";
  const rateValueStr = rateValue != null ? numToPercentFactory(2)(rateValue) : undefined;
  const newValueStr = newValue != null ? `+${numToGroupedString(newValue)}` : undefined;

  return (
    <Card className="text-center">
      <Card.Header className="h5 text-light" style={{ backgroundColor: color }}>
        {title}{" "}
        {rateValueStr && (
          <small>
            <div className="d-xs-block d-md-none" />({rateValueStr})
          </small>
        )}
      </Card.Header>
      <Card.Body className="p-3">
        <Card.Text>
          <span className="h4 text-shadow-dark">{valueStr}</span>
        </Card.Text>
      </Card.Body>
      <Card.Footer className="p-1">
        <span className="h6">{newValueStr}</span>
        {footerInformation}
      </Card.Footer>
    </Card>
  );
};
