import React, { FunctionComponent, useEffect, useState } from 'react';
import CovidDataStore, { LocationData } from '../../../store/CovidDataStore';
import DataPage from '../../common/DataPage';
import { IMAGES } from '../../../constants';
import useSingleLocationSelection from '../../common/SingleLocationSelection/useSingleLocationSelection';
import { NumberParam, StringParam, useQueryParam } from 'use-query-params';

interface CountryStateComparisonProps {
  store: CovidDataStore
}

const CountryStateComparison: FunctionComponent<CountryStateComparisonProps> = ({ store }) => {
  const [locations] = useState(store.locations);
  const [data, setData] = useState<LocationData>();
  const [lastUpdated, setLastUpdated] = useState<Date>();
  const [areChartAnimationsActive, setAreChartAnimationsActive] = useState(true);

  const [location, locationInputComponent] = useSingleLocationSelection(locations);
  const [exceedingProperty = 'confirmed', setExceedingProperty] = useQueryParam('exceedingProperty', StringParam);
  const [exceedingValue = 100, setExceedingValue] = useQueryParam('exceedingValue', NumberParam);

  const chartId = 'country-state-comparison-chart';
  const title = `COVID-19 Comparison: ${location}`;
  const pageDescription = `DRAFT`;

  useEffect(() => {
    // Set current query params in the URL, just in case they are missing.
    setExceedingProperty(exceedingProperty);
    setExceedingValue(exceedingValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const data = store.getDataByLocation(location);
    const lastUpdated = store.lastUpdated;
    const strippedData = CovidDataStore.stripDataBeforePropertyExceedsN(data, exceedingProperty, exceedingValue);

    setData(strippedData);
    setLastUpdated(lastUpdated);
  }, [store, location, exceedingProperty, exceedingValue]);

  function hasLoaded() {
    return (data != null && lastUpdated != null);
  }

  function handleDownloadClick() {
    return;
  }

  const optionsComponent = (
    <></>
  );

  const bodyComponent = (
    <></>
  );

  return (
    <DataPage
      title={title}
      pageDescription={pageDescription}
      ogImage={IMAGES.casesRecoveriesDeathsOg}
      lastUpdated={lastUpdated as Date}
      hasLoaded={hasLoaded()}
      bodyComponent={bodyComponent}
      optionsComponent={optionsComponent}
      dataContainerId={chartId}
      onDownloadClick={handleDownloadClick}
    />
  );
};

export default CountryStateComparison;
