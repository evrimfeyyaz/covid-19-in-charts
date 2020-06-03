import { COVID19API, LocationData } from "@evrimfeyyaz/covid-19-api";
import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api/lib/types";
import React, { FunctionComponent, useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Helmet from "react-helmet";
import { useCanonicalURL } from "../../../hooks/useCanonicalURL";
import useLocationSelection from "../../../hooks/useLocationSelection";
import { useNumberSelection } from "../../../hooks/useNumberSelection";
import { usePropertySelection } from "../../../hooks/usePropertySelection";
import {
  humanizePropertyName,
  stripDataBeforePropertyExceedsN,
} from "../../../utilities/covid19APIUtilities";
import { MDYStringToDate, prettifyDate } from "../../../utilities/dateUtilities";
import { createPageTitle } from "../../../utilities/metaUtilities";
import { getAbsoluteUrl } from "../../../utilities/urlUtilities";
import Loading from "../../common/Loading";
import NoData from "../../common/NoData";
import ShareButtons from "../../common/ShareButtons";
import SingleLocationConfirmedCases from "./ConfirmedCases/SingleLocationConfirmedCases";
import SingleLocationDeaths from "./Deaths/SingleLocationDeaths";
import SingleLocationLatestNumbers from "./LatestNumbers/SingleLocationLatestNumbers";
import SingleLocationNewCases from "./NewCases/SingleLocationNewCases";
import SingleLocationNewDeaths from "./NewDeaths/SingleLocationNewDeaths";
import SingleLocationNewRecoveries from "./NewRecoveries/SingleLocationNewRecoveries";
import SingleLocationOverall from "./Overall/SingleLocationOverall";
import SingleLocationRecoveries from "./Recoveries/SingleLocationRecoveries";

interface SingleLocationProps {
  /**
   * The `COVID19API` instance to query the data from.
   */
  store: COVID19API;
}

/**
 * A page that shows various charts and explanations for a single location.
 */
const SingleLocation: FunctionComponent<SingleLocationProps> = ({ store }) => {
  const defaultLocation = "US";
  const defaultExceedingProperty = "confirmed";
  const defaultExceedingValue = 100;

  const [data, setData] = useState<LocationData>();
  const [latestValues, setLatestValues] = useState<ValuesOnDate>();
  const [locationsList] = useState(store.locations);
  const [lastUpdated, setLastUpdated] = useState<Date>();
  const [firstDate, setFirstDate] = useState<Date>();
  const [lastDate, setLastDate] = useState<Date>();

  const [[location], locationInputComponent] = useLocationSelection(
    locationsList,
    [defaultLocation],
    {
      lastSelectionAsDefault: true,
      lastSelectionStorageKey: "casesRecoveriesDeathsLastLocation",
    }
  );
  const [exceedingProperty, , exceedingPropertyInputComponent] = usePropertySelection(
    "exceedingProperty",
    defaultExceedingProperty,
    "Start from the day",
    {
      onlyCumulativeValues: true,
      lastSelectionAsDefault: true,
      lastSelectionStorageKey: "caseRecoveriesLastExceedingProperty",
    }
  );
  const [exceedingValue, exceedingValueInputComponent] = useNumberSelection(
    "exceedingValue",
    defaultExceedingValue,
    "exceeded",
    {
      lastSelectionAsDefault: true,
      lastSelectionStorageKey: "caseRecoveriesLastExceedingValue",
    }
  );
  const canonicalQueryParams = ["location", "exceedingProperty", "exceedingValue"];
  const ogImage = "";

  const title = `COVID-19 Cases, Recoveries & Deaths: ${location}`;
  const pageDescription = `See the number of confirmed cases, new cases, recoveries and deaths in ${location}.`;

  let subtitle = "";
  if (firstDate != null && lastDate != null) {
    subtitle = `${prettifyDate(firstDate)} — ${prettifyDate(lastDate)}`;
  }

  const pageTitle = createPageTitle(title);
  const canonicalUrl = useCanonicalURL(canonicalQueryParams);

  function clearData(): void {
    setData(undefined);
    setLastUpdated(undefined);
    setFirstDate(undefined);
    setLastDate(undefined);
  }

  useEffect(() => {
    clearData();

    store.getDataByLocation(location).then((data) => {
      const lastUpdated = store.sourceLastUpdatedAt;
      const latestValues = data.values[data.values.length - 1];
      const strippedData = stripDataBeforePropertyExceedsN(data, exceedingProperty, exceedingValue);

      if (strippedData.values.length > 0) {
        const firstDate = MDYStringToDate(strippedData.values[0].date);
        const lastDate = MDYStringToDate(strippedData.values[strippedData.values.length - 1].date);

        setFirstDate(firstDate);
        setLastDate(lastDate);
      }

      setLatestValues(latestValues);
      setData(strippedData);
      setLastUpdated(lastUpdated);
    });
  }, [store, location, exceedingProperty, exceedingValue]);

  let body = <Loading />;
  if (data != null) {
    body = <NoData />;

    if (lastUpdated != null && latestValues != null && firstDate != null && lastDate != null) {
      const humanizedExceedingProperty = humanizePropertyName(exceedingProperty);
      const prettyFirstDate = prettifyDate(firstDate);
      const startingFrom = `the day ${humanizedExceedingProperty} exceeded ${exceedingValue} (${prettyFirstDate})`;
      const xAxisTitle = `Days since ${humanizedExceedingProperty} exceeded ${exceedingValue}`;

      body = (
        <Row>
          <Col xs={12} lg={4} className="d-flex flex-column px-4 py-3">
            {locationInputComponent}
            <Accordion>
              <Accordion.Toggle as={Button} variant="link" eventKey="0" className="w-100">
                More Options
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0" className="py-2">
                <Card className="bg-transparent border-white">
                  <Card.Body>
                    <Col xs={12}>{exceedingPropertyInputComponent}</Col>
                    <Col xs={12}>{exceedingValueInputComponent}</Col>
                  </Card.Body>
                </Card>
              </Accordion.Collapse>
            </Accordion>
            <div className="mt-auto d-none d-lg-block">
              <h2 className="h5 mt-3">Share</h2>
              <ShareButtons title={pageTitle} url={window.location.href} small={false} />
            </div>
          </Col>
          <Col>
            <h1>COVID-19: {location}</h1>
            {subtitle && <p className="small text-muted ml-1 mb-5">{subtitle}</p>}

            <SingleLocationLatestNumbers values={latestValues} />

            <SingleLocationConfirmedCases
              startingFrom={startingFrom}
              xAxisTitle={xAxisTitle}
              values={data.values}
            />

            <SingleLocationNewCases
              startingFrom={startingFrom}
              xAxisTitle={xAxisTitle}
              values={data.values}
              emaRange={12}
            />

            <SingleLocationDeaths
              startingFrom={startingFrom}
              xAxisTitle={xAxisTitle}
              values={data.values}
            />

            <SingleLocationNewDeaths
              emaRange={12}
              startingFrom={startingFrom}
              xAxisTitle={xAxisTitle}
              values={data.values}
            />

            <SingleLocationRecoveries
              startingFrom={startingFrom}
              xAxisTitle={xAxisTitle}
              values={data.values}
            />

            <SingleLocationNewRecoveries
              emaRange={12}
              startingFrom={startingFrom}
              xAxisTitle={xAxisTitle}
              values={data.values}
            />

            <SingleLocationOverall
              startingFrom={startingFrom}
              xAxisTitle={xAxisTitle}
              values={data.values}
            />

            <p className="my-0 font-weight-light font-italic text-muted">
              <small>
                covid19incharts.com | source:{" "}
                <a
                  className="text-decoration-none"
                  href="https://github.com/CSSEGISandData/COVID-19"
                >
                  JHU CSSE
                </a>{" "}
                | last updated: {lastUpdated.toUTCString()}
              </small>
            </p>
          </Col>
          <Row className="d-lg-none mt-3">
            <Col className="px-5">
              <h2 className="h5 mt-3">Share</h2>
              <ShareButtons title={pageTitle} url={window.location.href} small={true} />
            </Col>
          </Row>
        </Row>
      );
    }
  }

  return (
    <Container>
      <Helmet>
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={getAbsoluteUrl(ogImage)} />
        <meta name="twitter:image:alt" content={pageTitle} />
      </Helmet>
      {body}
    </Container>
  );
};

export default SingleLocation;
