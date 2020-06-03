import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import React, { FunctionComponent } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { COLORS } from "../../../../constants";
import NoData from "../../../common/NoData";
import SingleLocationLatestNumbersItem from "./SingleLocationLatestNumbersItem";

interface LatestNumbersProps {
  data?: ValuesOnDate;
}

const SingleLocationLatestNumbers: FunctionComponent<LatestNumbersProps> = ({ data }) => {
  let body = <NoData />;

  if (data != null) {
    const {
      confirmed,
      newConfirmed,
      recovered,
      deaths,
      newRecovered,
      newDeaths,
      mortalityRate,
      recoveryRate,
    } = data;

    body = (
      <Row>
        <Col xs={4}>
          <SingleLocationLatestNumbersItem
            color={COLORS.confirmed}
            title="Confirmed Cases"
            value={confirmed}
            newValue={newConfirmed}
          />
        </Col>
        <Col xs={4}>
          <SingleLocationLatestNumbersItem
            color={COLORS.deaths}
            title="Deaths"
            value={deaths}
            newValue={newDeaths}
            rateValue={mortalityRate}
          />
        </Col>
        <Col xs={4}>
          <SingleLocationLatestNumbersItem
            color={COLORS.recovered}
            title="Recoveries"
            value={recovered}
            newValue={newRecovered}
            rateValue={recoveryRate}
          />
        </Col>
      </Row>
    );
  }

  return body;
};

export default SingleLocationLatestNumbers;
