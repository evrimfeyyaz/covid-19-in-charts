import { COVID19API, LocationData } from "@evrimfeyyaz/covid-19-api";
import React, { FunctionComponent, useEffect, useState } from "react";
import { IMAGES } from "../../../constants";
import useLocationSelection from "../../../hooks/useLocationSelection";
import { useNumberSelection } from "../../../hooks/useNumberSelection";
import { usePropertySelection } from "../../../hooks/usePropertySelection";
import { stripDataBeforePropertyExceedsN } from "../../../utilities/covid19APIUtilities";
import { MDYStringToDate, prettifyDate } from "../../../utilities/dateUtilities";
import { downloadNode } from "../../../utilities/nodeToImageUtilities";
import DataPage from "../../common/DataPage";
import CasesRecoveriesDeathsChart from "./CasesRecoveriesDeathsChart";

interface CasesRecoveriesDeathsProps {
  store: COVID19API;
}

const CasesRecoveriesDeaths: FunctionComponent<CasesRecoveriesDeathsProps> = ({ store }) => {
  const defaultLocation = "US";
  const defaultExceedingProperty = "confirmed";
  const defaultExceedingValue = 100;

  const [locationsList] = useState(store.locations);
  const [data, setData] = useState<LocationData>();
  const [lastUpdated, setLastUpdated] = useState<Date>();
  const [areChartAnimationsActive, setAreChartAnimationsActive] = useState(true);
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
  const [
    exceedingProperty,
    humanizedExceedingProperty,
    exceedingPropertyInputComponent,
  ] = usePropertySelection("exceedingProperty", defaultExceedingProperty, "Start from the day", {
    onlyCumulativeValues: true,
    lastSelectionAsDefault: true,
    lastSelectionStorageKey: "caseRecoveriesLastExceedingProperty",
  });
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

  const chartId = "cases-recoveries-deaths-chart";
  const title = `COVID-19 Cases, Recoveries & Deaths: ${location}`;
  const pageDescription = `See the number of confirmed cases, new cases, recoveries and deaths in ${location}.`;

  let subtitle = "";
  if (firstDate != null && lastDate != null) {
    subtitle = `${prettifyDate(firstDate)} — ${prettifyDate(lastDate)}`;
  }

  function clearData(): void {
    setData(undefined);
    setLastUpdated(undefined);
    setFirstDate(undefined);
    setLastDate(undefined);
  }

  function handleDownloadClick(): void {
    setAreChartAnimationsActive(false);
    const node = document.getElementById(chartId) as HTMLElement;
    downloadNode(node)
      .catch(console.error)
      .finally(() => setAreChartAnimationsActive(true));
  }

  function hasLoaded(): boolean {
    return data != null && lastUpdated != null;
  }

  useEffect(() => {
    clearData();

    store.getDataByLocation(location).then((data) => {
      const lastUpdated = store.sourceLastUpdatedAt;
      const strippedData = stripDataBeforePropertyExceedsN(data, exceedingProperty, exceedingValue);

      if (strippedData.values.length > 0) {
        const firstDate = MDYStringToDate(strippedData.values[0].date);
        const lastDate = MDYStringToDate(strippedData.values[strippedData.values.length - 1].date);

        setFirstDate(firstDate);
        setLastDate(lastDate);
      }

      setData(strippedData);
      setLastUpdated(lastUpdated);
    });
  }, [store, location, exceedingProperty, exceedingValue]);

  const bodyComponent = (
    <CasesRecoveriesDeathsChart
      data={data?.values}
      humanizedExceedingProperty={humanizedExceedingProperty}
      exceedingValue={exceedingValue}
      isAnimationActive={areChartAnimationsActive}
    />
  );

  return (
    <DataPage
      title={title}
      subTitle={subtitle}
      pageDescription={pageDescription}
      ogImage={IMAGES.casesRecoveriesDeathsOg}
      lastUpdated={lastUpdated as Date}
      hasLoaded={hasLoaded()}
      bodyComponent={bodyComponent}
      optionsComponents={[locationInputComponent]}
      advancedOptionsComponents={[exceedingPropertyInputComponent, exceedingValueInputComponent]}
      dataContainerId={chartId}
      canonicalQueryParams={canonicalQueryParams}
      onDownloadClick={handleDownloadClick}
    />
  );
};

export default CasesRecoveriesDeaths;
