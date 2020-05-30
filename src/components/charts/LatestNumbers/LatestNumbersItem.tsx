import React, { FunctionComponent } from "react";
import Card from "react-bootstrap/Card";
import { numToGroupedString } from "../../../utilities/numUtilities";

interface LatestNumbersItemProps {
  title: string;
  value: number | null;
  headerBgColor: string;
  newValue?: number | null;
  rateValue?: number | null;
  headerLight?: boolean;
}

const LatestNumbersItem: FunctionComponent<LatestNumbersItemProps> = ({
  headerBgColor,
  title,
  value,
  rateValue,
  newValue,
  headerLight = false,
}) => {
  const valueStr = value ? numToGroupedString(value) : "No Data";
  const rateValueStr = rateValue ? (rateValue * 100).toFixed(2) : undefined;
  const newValueStr = newValue ? `+${numToGroupedString(newValue)}` : undefined;

  let headerClassNames = "h5";
  if (headerLight) {
    headerClassNames += " text-light";
  }

  return (
    <Card className="text-center">
      <Card.Header className={headerClassNames} style={{ backgroundColor: headerBgColor }}>
        {title}{" "}
        {rateValueStr && (
          <small>
            <div className="d-xs-block d-md-none" />({rateValueStr}%)
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
      </Card.Footer>
    </Card>
  );
};

export default LatestNumbersItem;
