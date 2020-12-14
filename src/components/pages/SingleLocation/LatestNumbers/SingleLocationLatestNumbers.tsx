import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import { FunctionComponent } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { COLORS } from "../../../../constants";
import { getFormattedValuesOnDate } from "../../../../utilities/covid19ApiUtilities";
import { dateKeyToDate, getFormattedDate } from "../../../../utilities/dateUtilities";
import { MoreInfo } from "../common/MoreInfo";
import { SingleLocationLatestNumbersItem } from "./SingleLocationLatestNumbersItem";

interface LatestNumbersProps {
  /**
   * The name of the location.
   */
  locationName: string;
  /**
   * A `ValuesOnDate` object containing the values for the latest data point.
   */
  values: ValuesOnDate;
}

/**
 * A component that shows the latest numbers (confirmed cases, deaths and recoveries) for a single
 * location.
 */
export const SingleLocationLatestNumbers: FunctionComponent<LatestNumbersProps> = ({
  values,
  locationName,
}) => {
  const {
    date,
    confirmed,
    newConfirmed,
    recovered,
    deaths,
    newRecovered,
    newDeaths,
    caseFatalityRate,
    recoveryRate,
  } = values;

  const { activeCases } = getFormattedValuesOnDate(values);

  const formattedDate = getFormattedDate(dateKeyToDate(date));

  let footerInformation: JSX.Element | undefined = undefined;
  if (newRecovered == null) {
    footerInformation = (
      <MoreInfo
        text="Why?"
        info="Unfortunately, the Johns Hopkins University CSSE time series data does not include the recoveries information for the UK, the Netherlands, Sweden, Canada's provinces and the US states."
        title="Recoveries Data"
      />
    );
  }

  return (
    <section className="mb-5">
      <header className="mb-4">
        <h2>
          Latest Numbers <small className="text-muted">{formattedDate}</small>
        </h2>
        {activeCases && (
          <p>
            On {formattedDate}, there were{" "}
            <MoreInfo
              text={`${activeCases} active confirmed cases`}
              info={
                <img
                  src={"images/active-cases.svg"}
                  alt="Confirmed Cases - (Deaths + Recoveries)"
                  className="img-fluid"
                />
              }
              title="Active Cases"
            />{" "}
            in {locationName}.
          </p>
        )}
      </header>
      <Row>
        <Col xs={4} data-testid="latest-confirmed-card-container">
          <SingleLocationLatestNumbersItem
            color={COLORS.confirmed}
            title="Confirmed Cases"
            value={confirmed}
            newValue={newConfirmed}
          />
        </Col>
        <Col xs={4} data-testid="latest-deaths-card-container">
          <SingleLocationLatestNumbersItem
            color={COLORS.deaths}
            title="Deaths"
            value={deaths}
            newValue={newDeaths}
            rateValue={caseFatalityRate}
          />
        </Col>
        <Col xs={4} data-testid="latest-recovered-card-container">
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
