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
import { COLORS } from "../../constants";
import { useCanonicalURL } from "../../hooks/useCanonicalURL";
import useLocationSelection from "../../hooks/useLocationSelection";
import { useNumberSelection } from "../../hooks/useNumberSelection";
import { usePropertySelection } from "../../hooks/usePropertySelection";
import { stripDataBeforePropertyExceedsN } from "../../utilities/covid19APIUtilities";
import { MDYStringToDate, prettifyDate, prettifyMDYDate } from "../../utilities/dateUtilities";
import { createPageTitle } from "../../utilities/metaUtilities";
import { getAbsoluteUrl } from "../../utilities/urlUtilities";
import BarChart from "../charts/BarChart";
import LatestNumbers from "../charts/LatestNumbers/LatestNumbers";
import LineChart from "../charts/LineChart";
import Loading from "../common/Loading";
import NoData from "../common/NoData";
import ShareButtons from "../common/ShareButtons";

interface SingleLocationProps {
  store: COVID19API;
}

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

    if (lastUpdated != null && latestValues != null) {
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
            {subtitle && <p className="small text-muted ml-1 mb-4">{subtitle}</p>}

            <section className="mb-5">
              <h2 className="mb-3">
                Latest Numbers{" "}
                <small className="text-muted">{prettifyMDYDate(latestValues.date)}</small>
              </h2>
              <LatestNumbers data={latestValues} />
            </section>

            <h2 className="mb-3">Confirmed Cases</h2>
            <LineChart
              data={data.values}
              lines={[
                {
                  dataKey: "confirmed",
                  name: "Confirmed Cases",
                  color: COLORS.confirmed,
                },
              ]}
              xAxisTitle="Test"
              yAxisTitle="Test"
            />

            <h2 className="mb-3">New Cases</h2>
            <BarChart
              data={data.values}
              bars={[
                {
                  dataKey: "newConfirmed",
                  name: "New Cases",
                  color: COLORS.newConfirmed,
                },
              ]}
              xAxisTitle="Test"
              yAxisTitle="Test"
              movingAverageDataKey="newConfirmed"
            />

            <h2 className="mb-3">Deaths</h2>
            <LineChart
              data={data.values}
              lines={[
                {
                  dataKey: "deaths",
                  name: "Deaths",
                  color: COLORS.deaths,
                },
              ]}
              xAxisTitle="Test"
              yAxisTitle="Test"
            />

            <h2 className="mb-3">New Deaths</h2>
            <BarChart
              data={data.values}
              bars={[
                {
                  dataKey: "newDeaths",
                  name: "New Deaths",
                  color: COLORS.deaths,
                },
              ]}
              xAxisTitle="Test"
              yAxisTitle="Test"
              movingAverageDataKey="newDeaths"
            />

            <h2 className="mb-3">Recoveries</h2>
            <LineChart
              data={data.values}
              lines={[
                {
                  dataKey: "recovered",
                  name: "Recoveries",
                  color: COLORS.recovered,
                },
              ]}
              xAxisTitle="Test"
              yAxisTitle="Test"
            />

            <h2 className="mb-3">New Recoveries</h2>
            <BarChart
              data={data.values}
              bars={[
                {
                  dataKey: "newRecovered",
                  name: "New Recoveries",
                  color: COLORS.recovered,
                },
              ]}
              xAxisTitle="Test"
              yAxisTitle="Test"
              movingAverageDataKey="newRecovered"
            />

            <h2 className="mb-3">Mortality Rate</h2>
            <LineChart
              data={data.values}
              lines={[
                {
                  dataKey: "mortalityRate",
                  name: "Mortality Rate",
                  color: COLORS.deaths,
                },
              ]}
              xAxisTitle="Test"
              yAxisTitle="Test"
            />

            <h2 className="mb-3">Recovery Rate</h2>
            <LineChart
              data={data.values}
              lines={[
                {
                  dataKey: "recoveryRate",
                  name: "Recovery Rate",
                  color: COLORS.recovered,
                },
              ]}
              xAxisTitle="Test"
              yAxisTitle="Test"
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
