import React, { FunctionComponent, useEffect, useState } from 'react';
import CovidDataStore, { LocationData, DateValuesProperties } from '../../../store/CovidDataStore';
import DataPage from '../../common/DataPage';
import { IMAGES, SETTINGS } from '../../../constants';
import { NumberParam, StringParam, useQueryParam } from 'use-query-params';
import { ExceedingProperty } from '../CasesRecoveriesDeaths/CasesRecoveriesDeathsOptions';
import CountryStateComparisonOptions from './CountryStateComparisonOptions';
import CountryStateComparisonChart from './CountryStateComparisonChart';
import useLocationSelection from '../../../hooks/useLocationSelection';
import _ from 'lodash';

interface CountryStateComparisonProps {
  store: CovidDataStore
}

const CountryStateComparison: FunctionComponent<CountryStateComparisonProps> = ({ store }) => {
  const [locationsList] = useState(store.locations);
  const [data, setData] = useState<LocationData[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>();
  const [areChartAnimationsActive, setAreChartAnimationsActive] = useState(true);

  const [locations, locationInputComponent] = useLocationSelection(locationsList, [SETTINGS.defaultLocation], true);
  const [property = 'confirmed', setProperty] = useQueryParam('property', StringParam);
  const [exceedingProperty = 'confirmed', setExceedingProperty] = useQueryParam('exceedingProperty', StringParam);
  const [exceedingValue = 100, setExceedingValue] = useQueryParam('exceedingValue', NumberParam);

  const chartId = 'country-state-comparison-chart';
  const humanizedProperty = _.startCase(CovidDataStore.humanizePropertyName(property as DateValuesProperties));
  const title = `COVID-19 ${humanizedProperty} Comparison`;
  const pageDescription = `DRAFT`;

  useEffect(() => {
    // Set current query params in the URL, just in case they are missing.
    setProperty(property);
    setExceedingProperty(exceedingProperty);
    setExceedingValue(exceedingValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const data = store.getDataByLocations(locations);
    const lastUpdated = store.lastUpdated;
    const strippedData = data.map(locationData =>
      CovidDataStore.stripDataBeforePropertyExceedsN(locationData, exceedingProperty, exceedingValue),
    );

    setData(strippedData);
    setLastUpdated(lastUpdated);
  }, [store, locations, exceedingProperty, exceedingValue]);

  function hasLoaded() {
    return (data != null && lastUpdated != null);
  }

  function handleDownloadClick() {
    return;
  }

  function handlePropertyChange(propertyNew: string) {
    setProperty(propertyNew);
  }

  function handleExceedingPropertyChange(exceedingPropertyNew: ExceedingProperty) {
    setExceedingProperty(exceedingPropertyNew);
  }

  function handleExceedingValueChange(exceedingValueNew: number) {
    setExceedingValue(exceedingValueNew);
  }

  const optionsComponent = (
    <CountryStateComparisonOptions
      locationInputComponent={locationInputComponent}
      property={property}
      exceedingProperty={exceedingProperty as ExceedingProperty}
      exceedingValue={exceedingValue}
      onExceedingPropertyChange={handleExceedingPropertyChange}
      onExceedingValueChange={handleExceedingValueChange}
      onPropertyChange={handlePropertyChange}
    />
  );

  const bodyComponent = (
    <CountryStateComparisonChart
      data={data}
      property={property}
      exceedingProperty={exceedingProperty}
      exceedingValue={exceedingValue}
      isAnimationActive={areChartAnimationsActive}
    />
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
