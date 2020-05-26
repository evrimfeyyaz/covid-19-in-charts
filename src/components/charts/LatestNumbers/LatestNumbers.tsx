import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import React, { FunctionComponent } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { COLORS } from "../../../constants";
import NoData from "../../common/NoData";
import LatestNumbersItem from "./LatestNumbersItem";

interface LatestNumbersProps {
  data?: ValuesOnDate;
}

const LatestNumbers: FunctionComponent<LatestNumbersProps> = ({ data }) => {
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
      date,
    } = data;

    body = (
      <>
        <h2 className="mb-3">
          Latest Numbers <small className="text-muted">{date}</small>
        </h2>

        <Row>
          <Col xs={4}>
            <LatestNumbersItem
              headerBgColor={COLORS.confirmed}
              title="Confirmed Cases"
              value={confirmed}
              newValue={newConfirmed}
            />
          </Col>
          <Col xs={4}>
            <LatestNumbersItem
              headerBgColor={COLORS.deaths}
              title="Deaths"
              value={deaths}
              newValue={newDeaths}
              rateValue={mortalityRate}
              headerLight
            />
          </Col>
          <Col xs={4}>
            <LatestNumbersItem
              headerBgColor={COLORS.recovered}
              title="Recoveries"
              value={recovered}
              newValue={newRecovered}
              rateValue={recoveryRate}
              headerLight
            />
          </Col>
        </Row>
      </>
    );
  }

  return body;
};

export default LatestNumbers;
