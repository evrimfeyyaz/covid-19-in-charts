import { COVID19API, LocationData } from "@evrimfeyyaz/covid-19-api";
import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api/lib/types";
import React, { FunctionComponent, useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Helmet } from "react-helmet";
import { useParams } from "react-router";
import { NumberParam, useQueryParam, withDefault } from "use-query-params";
import { SITE_INFO } from "../../../constants";
import {
  filterDatesWithMinConfirmedCases,
  getLocationName,
} from "../../../utilities/covid19ApiUtilities";
import { dateKeyToDate, getReadableDate } from "../../../utilities/dateUtilities";
import { createPageTitle } from "../../../utilities/metaUtilities";
import { numToGroupedString } from "../../../utilities/numUtilities";
import { getAbsoluteUrl, getCanonicalUrl } from "../../../utilities/urlUtilities";
import { Loading } from "../../common/Loading";
import { LocationSelectionInput } from "../../common/LocationSelectionInput";
import { MinConfirmedCasesInput } from "../../common/MinConfirmedCasesInput";
import { NoData } from "../../common/NoData";
import { ShareButtons } from "../../common/ShareButtons";
import { SingleLocationConfirmedCases } from "./ConfirmedCases/SingleLocationConfirmedCases";
import { SingleLocationDeaths } from "./Deaths/SingleLocationDeaths";
import { SingleLocationLatestNumbers } from "./LatestNumbers/SingleLocationLatestNumbers";
import { SingleLocationNewCases } from "./NewCases/SingleLocationNewCases";
import { SingleLocationNewDeaths } from "./NewDeaths/SingleLocationNewDeaths";
import { SingleLocationNewRecoveries } from "./NewRecoveries/SingleLocationNewRecoveries";
import { SingleLocationOverall } from "./Overall/SingleLocationOverall";
import { SingleLocationRecoveries } from "./Recoveries/SingleLocationRecoveries";

interface SingleLocationProps {
  /**
   * The `COVID19API` instance to query the data from.
   */
  store: COVID19API;
}

/**
 * A page that shows various charts and explanations for a single location.
 */
export const SingleLocation: FunctionComponent<SingleLocationProps> = ({ store }) => {
  const { countryOrRegion = "US", provinceOrState, county } = useParams();
  const location = getLocationName(countryOrRegion, provinceOrState, county);

  const [data, setData] = useState<LocationData>();
  const [latestValues, setLatestValues] = useState<ValuesOnDate>();
  const [locationsList] = useState(store.locations);
  const [lastUpdated, setLastUpdated] = useState<Date>();
  const [firstDate, setFirstDate] = useState<Date>();
  const [lastDate, setLastDate] = useState<Date>();

  /**
   * When this is set to a number, the data filtered to only include the dates that exceeded this
   * number of confirmed cases. If this is set to `null`, then no filtering is applied.
   */
  const [minConfirmedCases, setMinConfirmedCases] = useQueryParam(
    "minConfirmedCases",
    withDefault(NumberParam, 100, false)
  );

  function clearData(): void {
    setData(undefined);
    setLastUpdated(undefined);
    setFirstDate(undefined);
    setLastDate(undefined);
  }

  /**
   * Adds query parameters to the location just in case they are missing. For example, they are
   * missing when the page is first requested without any query parameters.
   */
  useEffect(() => {
    // TODO: I don't think this is necessary, remove this.
    setMinConfirmedCases(minConfirmedCases, "replaceIn");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Loads the data.
   */
  useEffect(() => {
    clearData();

    store.getDataByLocation(location).then((data) => {
      const lastUpdated = store.sourceLastUpdatedAt;
      const latestValues = data.values[data.values.length - 1];

      let filteredData = data;
      if (minConfirmedCases != null) {
        filteredData = filterDatesWithMinConfirmedCases(data, minConfirmedCases);
      }

      if (filteredData.values.length > 0) {
        const firstDate = dateKeyToDate(filteredData.values[0].date);
        const lastDate = dateKeyToDate(filteredData.values[filteredData.values.length - 1].date);

        setFirstDate(firstDate);
        setLastDate(lastDate);
      }

      setLatestValues(latestValues);
      setData(filteredData);
      setLastUpdated(lastUpdated);
    });
  }, [store, location, minConfirmedCases]);

  /**
   * Stores user settings in local storage when they change.
   */
  useEffect(() => {
    localStorage.setItem("location", location);
  }, [location]);

  /**
   * Handles the location change.
   *
   * @param selectedLocations The input component we are using returns an array of selections,
   *   hence the reason why this is an array.
   */
  function handleLocationChange(selectedLocations: string[]): void {
    if (selectedLocations.length > 0) {
      return;
    }
  }

  /**
   * Handles the minimum number of confirmed cases selection change.
   *
   * @param value A number, or `null` if minimum number of confirmed cases filtering should be off.
   */
  function handleMinConfirmedCasesChange(value: number | null): void {
    setMinConfirmedCases(value);
  }

  // TODO: Add an image to this page.
  const ogImage = "";

  // TODO: Prepend the definite article before certain country names, such as the US.
  const pageDescription = `See the progression of COVID-19 in ${location}.`;

  const title = `COVID-19: ${location}`;
  const pageTitle = createPageTitle(SITE_INFO.baseTitle, title);

  let subtitle = "";
  if (firstDate != null && lastDate != null) {
    subtitle = `${getReadableDate(firstDate)} — ${getReadableDate(lastDate)}`;
  }

  const canonicalUrl = getCanonicalUrl(window.location.href, SITE_INFO.baseUrl, [
    "location",
    "minConfirmedCases",
    "filterMinConfirmedCases",
  ]);

  let body = <Loading />;
  if (data != null) {
    body = <NoData />;

    if (lastUpdated != null && latestValues != null && firstDate != null && lastDate != null) {
      const readableFirstDate = getReadableDate(firstDate);

      let startingFrom = readableFirstDate;
      let xAxisTitle: string | null = null;
      if (minConfirmedCases != null) {
        const groupedMinConfirmedCases = numToGroupedString(minConfirmedCases);
        startingFrom = `the day confirmed cases exceeded ${groupedMinConfirmedCases} (${readableFirstDate})`;
        xAxisTitle = `Days since confirmed cases exceeded ${groupedMinConfirmedCases}`;
      }

      body = (
        <Row>
          {/*TODO: Separate the sidebar.*/}
          <Col xs={12} lg={4} className="d-flex flex-column px-4 py-3">
            <LocationSelectionInput
              locationsList={locationsList}
              defaultLocations={[location]}
              id="location-selection-input"
              placeholder={"Select locations..."}
              onChange={handleLocationChange}
            />

            <MinConfirmedCasesInput
              value={minConfirmedCases}
              onChange={handleMinConfirmedCasesChange}
            />

            <div className="d-none d-lg-block">
              <h2 className="h5 mt-3">Share</h2>
              <ShareButtons title={pageTitle} url={canonicalUrl} small={false} />
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
          </Col>
          <Row className="d-lg-none mt-3">
            <Col className="px-5">
              <h2 className="h5 mt-3">Share</h2>
              <ShareButtons title={pageTitle} url={canonicalUrl} small={true} />
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
        <meta property="og:image" content={getAbsoluteUrl(SITE_INFO.baseUrl, ogImage)} />
        <meta name="twitter:image:alt" content={pageTitle} />
      </Helmet>
      {body}
    </Container>
  );
};
