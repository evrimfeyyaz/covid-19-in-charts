import React, { FunctionComponent } from "react";
import Card from "react-bootstrap/Card";
import { numToGroupedString, numToPercentFactory } from "../../../../utilities/numUtilities";

interface LatestNumbersItemProps {
  title: string;
  value: number | null;
  color: string;
  newValue?: number | null;
  rateValue?: number | null;
}

const SingleLocationLatestNumbersItem: FunctionComponent<LatestNumbersItemProps> = ({
  color,
  title,
  value,
  rateValue,
  newValue,
}) => {
  const valueStr = value ? numToGroupedString(value) : "No Data";
  const rateValueStr = rateValue ? numToPercentFactory(2)(rateValue) : undefined;
  const newValueStr = newValue ? `+${numToGroupedString(newValue)}` : undefined;

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
      </Card.Footer>
    </Card>
  );
};

export default SingleLocationLatestNumbersItem;
