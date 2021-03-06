import { COVID19API, LocationData } from "@evrimfeyyaz/covid-19-api";
import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api/lib/types";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Helmet } from "react-helmet";
import { titleCase } from "title-case";
import { NumberParam, StringParam, useQueryParam, withDefault } from "use-query-params";
import { COLORS, SITE_INFO } from "../../../constants";
import { filterDatesWithMinConfirmedCases } from "../../../utilities/covid19ApiUtilities";
import { dateKeyToDate, getFormattedDate } from "../../../utilities/dateUtilities";
import { hasDefiniteArticle } from "../../../utilities/locationUtilities";
import { createPageTitle } from "../../../utilities/metaUtilities";
import { numToGroupedString } from "../../../utilities/numUtilities";
import { getCanonicalUrl } from "../../../utilities/urlUtilities";
import { Loading } from "../../common/Loading";
import { LocationSelectionInput } from "./common/inputs/LocationSelectionInput";
import { MinConfirmedCasesInput } from "./common/inputs/MinConfirmedCasesInput";
import { NoData } from "./common/NoData";
import { SingleLocationSectionCumulative } from "./common/sections/SingleLocationSectionCumulative";
import { SingleLocationSectionNew } from "./common/sections/SingleLocationSectionNew";
import { ShareButtons } from "./common/ShareButtons";
import { SingleLocationLatestNumbers } from "./LatestNumbers/SingleLocationLatestNumbers";
import { SingleLocationOverall } from "./Overall/SingleLocationOverall";

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
  const localStorageLastLocationKey = "location";
  const localStorageMinConfirmedCasesKey = "minConfirmedCases";

  const storedLastLocation = useMemo(() => localStorage.getItem(localStorageLastLocationKey), []);
  const defaultLocation = storedLastLocation != null ? JSON.parse(storedLastLocation) : "US";

  const storedMinConfirmedCases = useMemo(
    () => localStorage.getItem(localStorageMinConfirmedCasesKey),
    []
  );
  const defaultMinConfirmedCases: number | null = storedMinConfirmedCases
    ? JSON.parse(storedMinConfirmedCases)
    : 100;

  const [data, setData] = useState<LocationData>();
  const [latestValues, setLatestValues] = useState<ValuesOnDate>();
  const [locationsList] = useState(store.locations);
  const [lastUpdated, setLastUpdated] = useState<Date>();
  const [firstDate, setFirstDate] = useState<Date>();
  const [lastDate, setLastDate] = useState<Date>();

  /**
   * The location that is selected by the user. This is saved in a query parameter.
   */
  const [location, setLocation] = useQueryParam(
    "location",
    withDefault(StringParam, defaultLocation)
  );

  /**
   * When this is set to a number, the data filtered to only include the dates that exceeded this
   * number of confirmed cases. If this is set to `null`, then no filtering is applied.
   */
  const [minConfirmedCases, setMinConfirmedCases] = useQueryParam(
    "minConfirmedCases",
    withDefault(NumberParam, defaultMinConfirmedCases, false)
  );

  const locationHasDefiniteArticle = useMemo(() => hasDefiniteArticle(location), [location]);

  function clearData(): void {
    setData(undefined);
    setLastUpdated(undefined);
    setFirstDate(undefined);
    setLastDate(undefined);
  }

  /**
   * Loads the data.
   */
  useEffect(() => {
    clearData();

    store.getDataByLocation(location).then((data) => {
      const lastUpdated = store.sourceLastUpdatedAt;
      const latestValues = data.values[data.values.length - 1];

      // The recoveries data for the following countries is not included in the JHU CSSE dataset,
      // so we set them to `null` for the rest of the UI to know that this data is actually missing.
      // In the dataset the values are either "0" or incomplete.
      if (location === "United Kingdom" || location === "Netherlands" || location === "Sweden") {
        latestValues.newRecovered = null;
        latestValues.recovered = null;
        latestValues.recoveryRate = null;
        latestValues.activeCases = null;
      }

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
   * This is a bit of a hacky solution that makes sure that the query parameters are added to the
   * current location. They are not automatically added when the user first enters this page, and
   * we are using their default values.
   */
  useEffect(() => {
    setLocation(location, "replaceIn");
    setMinConfirmedCases(minConfirmedCases, "replaceIn");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Stores user settings in local storage when they change.
   */
  useEffect(() => {
    localStorage.setItem(localStorageLastLocationKey, JSON.stringify(location));
    localStorage.setItem(localStorageMinConfirmedCasesKey, JSON.stringify(minConfirmedCases));
  }, [location, minConfirmedCases]);

  /**
   * Handles the location change.
   *
   * @param selectedLocation
   */
  function handleLocationChange(selectedLocation: string): void {
    setLocation(selectedLocation);
  }

  /**
   * Handles the minimum number of confirmed cases selection change.
   *
   * @param value A number, or `null` if minimum number of confirmed cases filtering should be off.
   */
  function handleMinConfirmedCasesChange(value: number | null): void {
    setMinConfirmedCases(value);
  }

  const locationName = locationHasDefiniteArticle ? `the ${location}` : location;
  const pageDescription = `See the progression of COVID-19 in ${locationName}.`;

  const title = `COVID-19: ${titleCase(locationName)}`;
  const pageTitle = createPageTitle(SITE_INFO.baseTitle, title);

  let subtitle = "";
  if (firstDate != null && lastDate != null) {
    subtitle = `${getFormattedDate(firstDate)} — ${getFormattedDate(lastDate)}`;
  }

  const canonicalUrl = getCanonicalUrl(window.location.href, SITE_INFO.baseUrl, [
    "location",
    "minConfirmedCases",
  ]);

  let body = <Loading />;
  if (data != null) {
    body = <NoData />;

    if (lastUpdated != null && latestValues != null && firstDate != null && lastDate != null) {
      const formattedFirstDate = getFormattedDate(firstDate);

      let startingFrom = formattedFirstDate;
      let xAxisTitle: string | null = null;
      if (minConfirmedCases != null) {
        const groupedMinConfirmedCases = numToGroupedString(minConfirmedCases);
        startingFrom = `the day confirmed cases exceeded ${groupedMinConfirmedCases} (${formattedFirstDate})`;
        xAxisTitle = `Days since confirmed cases exceeded ${groupedMinConfirmedCases}`;
      }

      body = (
        <>
          <h1>{title}</h1>
          {subtitle && <p className="small text-muted ml-1 mb-3">{subtitle}</p>}

          <hr />

          <SingleLocationLatestNumbers values={latestValues} locationName={locationName} />

          <SingleLocationSectionCumulative
            property={"confirmed"}
            startingFrom={startingFrom}
            xAxisTitle={xAxisTitle}
            values={data.values}
            color={COLORS.confirmed}
          />

          <SingleLocationSectionNew
            startingFrom={startingFrom}
            xAxisTitle={xAxisTitle}
            values={data.values}
            property={"newConfirmed"}
            color={COLORS.confirmed}
            showEma={true}
          />

          <SingleLocationSectionCumulative
            property={"deaths"}
            startingFrom={startingFrom}
            xAxisTitle={xAxisTitle}
            values={data.values}
            color={COLORS.deaths}
          />

          <SingleLocationSectionNew
            startingFrom={startingFrom}
            xAxisTitle={xAxisTitle}
            values={data.values}
            property={"newDeaths"}
            color={COLORS.deaths}
            showEma={true}
          />

          {latestValues.recovered != null && (
            <SingleLocationSectionCumulative
              property={"recovered"}
              startingFrom={startingFrom}
              xAxisTitle={xAxisTitle}
              values={data.values}
              color={COLORS.recovered}
            />
          )}

          {latestValues.recovered != null && (
            <SingleLocationSectionNew
              startingFrom={startingFrom}
              xAxisTitle={xAxisTitle}
              values={data.values}
              property={"newRecovered"}
              color={COLORS.recovered}
            />
          )}

          {latestValues.recovered != null && latestValues.recoveryRate != null && (
            <SingleLocationOverall
              startingFrom={startingFrom}
              xAxisTitle={xAxisTitle}
              values={data.values}
            />
          )}

          <h2>About the Data</h2>
          <p>
            The source of the data on this page is{" "}
            <a
              href="https://github.com/CSSEGISandData/COVID-19"
              target="_blank"
              rel="noopener noreferrer"
            >
              the COVID-19 Data Repository by the Center for Systems Science and Engineering (CSSE)
              at Johns Hopkins University
            </a>
            .
          </p>
          <p>
            The last update was on{" "}
            {lastUpdated.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              year: "numeric",
              day: "numeric",
            })}{" "}
            at {lastUpdated.toLocaleTimeString("en-US", { timeZoneName: "short" })}.
          </p>
        </>
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
        <meta name="twitter:image:alt" content={pageTitle} />
      </Helmet>
      <Row style={{ minHeight: 500 }}>
        <Col xs={12} lg={4} className="d-flex flex-column px-4 py-3">
          <LocationSelectionInput
            locationsList={locationsList}
            defaultLocation={location}
            id="location-selection-input"
            onChange={handleLocationChange}
          />

          <MinConfirmedCasesInput
            value={minConfirmedCases}
            onChange={handleMinConfirmedCasesChange}
          />

          <div className="d-none d-lg-block">
            <h2 className="h4 mt-5 mb-3">Share</h2>
            <ShareButtons title={pageTitle} url={canonicalUrl} />
          </div>
        </Col>

        <Col>{body}</Col>
      </Row>

      <Row className="d-lg-none mt-2 mb-3">
        <Col className="px-5">
          <h2 className="h4 mt-2 mb-3">Share</h2>
          <ShareButtons title={pageTitle} url={canonicalUrl} />
        </Col>
      </Row>
    </Container>
  );
};
