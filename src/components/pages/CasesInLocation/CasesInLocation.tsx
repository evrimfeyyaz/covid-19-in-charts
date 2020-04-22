import React, { FunctionComponent, useEffect, useState } from 'react';
import CovidDataStore, { DateValues, LocationData } from '../../../store/CovidDataStore';
import CasesInLocationChart from './CasesInLocationChart';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { useQueryParam, StringParam, NumberParam } from 'use-query-params';
import CasesInLocationOptions, { ExceedingProperty } from './CasesInLocationOptions';
import { downloadNode } from '../../../utilities/nodeToImageUtilities';
import DataPage from '../../common/DataPage';
import { prettifyDate } from '../../../utilities/dateUtilities';

interface CasesInLocationProps {
  store: CovidDataStore,
}

const CasesInLocation: FunctionComponent<CasesInLocationProps> = ({ store }) => {
  const defaultLocation = 'US';

  const [locations] = useState(store.locations);
  const [data, setData] = useState<LocationData>();
  const [lastUpdated, setLastUpdated] = useState<Date>();
  const [areChartAnimationsActive, setAreChartAnimationsActive] = useState(true);
  const [firstDate, setFirstDate] = useState<Date>();
  const [lastDate, setLastDate] = useState<Date>();

  const [location = defaultLocation, setLocation] = useQueryParam('location', StringParam);
  const [exceedingProperty = 'confirmed', setExceedingProperty] = useQueryParam('exceedingProperty', StringParam);
  const [exceedingValue = 100, setExceedingValue] = useQueryParam('exceedingValue', NumberParam);

  const chartId = 'cases-in-location';
  const title = `COVID-19 Cases, Recoveries & Deaths: ${location}`;
  const pageDescription = `See the number of confirmed cases, new cases, recoveries and deaths in ${location}.`;

  let subtitle = '';
  if (firstDate != null && lastDate != null) {
    subtitle = `${prettifyDate(firstDate)} — ${prettifyDate(lastDate)}`
  }

  useEffect(() => {
    // Set current query params in the URL, just in case they are missing.
    setLocation(location);
    setExceedingProperty(exceedingProperty);
    setExceedingValue(exceedingValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const firstDate = store.firstDate;
    const lastDate = store.lastDate;

    setFirstDate(firstDate);
    setLastDate(lastDate);

    const data = store.getDataByLocation(location);
    const lastUpdated = store.lastUpdated;
    const strippedData = CovidDataStore.stripDataBeforePropertyExceedsN(data, exceedingProperty, exceedingValue);

    setData(strippedData);
    setLastUpdated(lastUpdated);
  }, [store, location, exceedingProperty, exceedingValue]);

  function handleLocationChange(locationNew: string) {
    setLocation(locationNew);
  }

  function handleExceedingPropertyChange(exceedingPropertyNew: ExceedingProperty) {
    setExceedingProperty(exceedingPropertyNew);
  }

  function handleExceedingValueChange(exceedingValueNew: number) {
    setExceedingValue(exceedingValueNew);
  }

  function handleDownloadClick() {
    setAreChartAnimationsActive(false);
    const node = document.getElementById(chartId) as HTMLElement;
    downloadNode(node)
      .finally(() => setAreChartAnimationsActive(true));
  }

  function hasLoaded() {
    return (data != null && lastUpdated != null);
  }

  const optionsComponent = (
    <CasesInLocationOptions
      locations={locations}
      location={location}
      exceedingProperty={exceedingProperty as ExceedingProperty}
      exceedingValue={exceedingValue}
      onLocationChange={handleLocationChange}
      onExceedingPropertyChange={handleExceedingPropertyChange}
      onExceedingValueChange={handleExceedingValueChange}
    />
  );

  const bodyComponent = (
    <CasesInLocationChart
      data={data?.values as DateValues}
      exceedingProperty={exceedingProperty}
      exceedingValue={exceedingValue}
      isAnimationActive={areChartAnimationsActive}
    />
  );

  return (
    <DataPage
      title={title}
      subTitle={subtitle}
      pageDescription={pageDescription}
      lastUpdated={lastUpdated as Date}
      hasLoaded={hasLoaded()}
      bodyComponent={bodyComponent}
      optionsComponent={optionsComponent}
      dataContainerId={chartId}
      onDownloadClick={handleDownloadClick}
    />
  );
};

export default CasesInLocation;
