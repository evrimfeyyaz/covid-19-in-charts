import { COVID19API, LocationData } from "@evrimfeyyaz/covid-19-api";
import React, { FunctionComponent, useEffect, useState } from "react";
import { stripDataBeforePropertyExceedsN } from "../../../utilities/covid19APIUtilities";
import DataPage from "../../common/DataPage";
import { IMAGES } from "../../../constants";
import LocationComparisonChart from "./LocationComparisonChart";
import useLocationSelection from "../../../hooks/useLocationSelection";
import { usePropertySelection } from "../../../hooks/usePropertySelection";
import _ from "lodash";
import { useNumberSelection } from "../../../hooks/useNumberSelection";
import { downloadNode } from "../../../utilities/nodeToImageUtilities";

interface LocationComparisonProps {
  store: COVID19API
}

const LocationComparison: FunctionComponent<LocationComparisonProps> = ({ store }) => {
  const defaultLocations = ["US", "Spain", "Italy", "United Kingdom"];
  const defaultProperty = "confirmed";
  const defaultExceedingProperty = "confirmed";
  const defaultExceedingValue = 100;

  const [locationsList] = useState(store.locations);
  const [data, setData] = useState<LocationData[]>();
  const [lastUpdated, setLastUpdated] = useState<Date>();
  const [areChartAnimationsActive, setAreChartAnimationsActive] = useState(true);

  const [
    locations,
    locationInputComponent]
    = useLocationSelection(locationsList, defaultLocations, {
    multiple: true,
    maxNumOfSelections: 10,
    lastSelectionAsDefault: true,
    lastSelectionStorageKey: "locationComparisonLastLocations",
  });
  const [
    property,
    humanizedProperty,
    propertyInputComponent,
  ] = usePropertySelection("property", defaultProperty, "Compare", {
    lastSelectionAsDefault: true,
    lastSelectionStorageKey: "locationComparisonLastProperty",
  });
  const [
    exceedingProperty,
    humanizedExceedingProperty,
    exceedingPropertyInputComponent,
  ] = usePropertySelection("exceedingProperty", defaultExceedingProperty, "Start from the day", {
    onlyCumulativeValues: true,
    lastSelectionAsDefault: true,
    lastSelectionStorageKey: "locationComparisonLastExceedingProperty",
  });
  const [
    exceedingValue,
    exceedingValueInputComponent,
  ] = useNumberSelection("exceedingValue", defaultExceedingValue, "exceeded", {
    lastSelectionAsDefault: true,
    lastSelectionStorageKey: "locationComparisonLastExceedingValue",
  });
  const canonicalQueryParams = ["location", "property", "exceedingProperty", "exceedingValue"];

  const chartId = "location-comparison-chart";
  const title = `COVID-19 ${_.startCase(humanizedProperty)} Comparison`;
  const pageDescription = "Comparison of various COVID-19 data points between multiple locations.";

  useEffect(() => {
    clearData();
    store.getDataByLocations(locations).then(data => {
      const lastUpdated = store.sourceLastUpdatedAt;
      const strippedData = data.map(locationData =>
        stripDataBeforePropertyExceedsN(locationData, exceedingProperty, exceedingValue),
      );

      setData(strippedData);
      setLastUpdated(lastUpdated);
    });
  }, [store, locations, exceedingProperty, exceedingValue]);

  function clearData() {
    setData(undefined);
    setLastUpdated(undefined);
  }

  function hasLoaded() {
    return (data != null && lastUpdated != null);
  }

  function handleDownloadClick() {
    setAreChartAnimationsActive(false);
    const node = document.getElementById(chartId) as HTMLElement;
    downloadNode(node)
      .finally(() => setAreChartAnimationsActive(true));
  }

  const bodyComponent = (
    <LocationComparisonChart
      data={data}
      property={property}
      humanizedProperty={humanizedProperty}
      humanizedExceedingProperty={humanizedExceedingProperty}
      exceedingValue={exceedingValue}
      isAnimationActive={areChartAnimationsActive}
    />
  );

  return (
    <DataPage
      title={title}
      pageDescription={pageDescription}
      ogImage={IMAGES.locationComparisonOg}
      lastUpdated={lastUpdated as Date}
      hasLoaded={hasLoaded()}
      bodyComponent={bodyComponent}
      optionsComponents={[locationInputComponent, propertyInputComponent]}
      advancedOptionsComponents={[exceedingPropertyInputComponent, exceedingValueInputComponent]}
      dataContainerId={chartId}
      canonicalQueryParams={canonicalQueryParams}
      onDownloadClick={handleDownloadClick}
    />
  );
};

export default LocationComparison;
