import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import React, { FunctionComponent } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { COLORS } from "../../../../constants";
import { dateKeyToDate, getFormattedDate } from "../../../../utilities/dateUtilities";
import { MoreInfo } from "../common/MoreInfo";
import { SingleLocationLatestNumbersItem } from "./SingleLocationLatestNumbersItem";

interface LatestNumbersProps {
  /**
   * A `ValuesOnDate` object containing the values for the latest data point.
   */
  values: ValuesOnDate;
}

/**
 * A component that shows the latest numbers (confirmed cases, deaths and recoveries) for a single
 * location.
 */
export const SingleLocationLatestNumbers: FunctionComponent<LatestNumbersProps> = ({ values }) => {
  const {
    date,
    confirmed,
    newConfirmed,
    recovered,
    deaths,
    newRecovered,
    newDeaths,
    mortalityRate,
    recoveryRate,
  } = values;

  const formattedDate = getFormattedDate(dateKeyToDate(date));

  let footerInformation: JSX.Element | undefined = undefined;
  if (newRecovered == null) {
    footerInformation = (
      <MoreInfo
        text="Why?"
        info="Unfortunately, the Johns Hopkins University CSSE data does not include the recoveries information for the UK, the Netherlands, Sweden, Canada's provinces and the US states."
        title="Recoveries Data"
      />
    );
  }

  return (
    <section className="mb-5">
      <h2 className="mb-4">
        Latest Numbers <small className="text-muted">{formattedDate}</small>
      </h2>
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
        <Col xs={4} data-testid="latest-recoveries-card-container">
          <SingleLocationLatestNumbersItem
            color={COLORS.recovered}
            title="Recoveries"
            value={recovered}
            newValue={newRecovered}
            rateValue={recoveryRate}
            footerInformation={footerInformation}
          />
        </Col>
      </Row>
    </section>
  );
};
