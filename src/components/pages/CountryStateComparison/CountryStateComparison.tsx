import React, { FunctionComponent, useEffect, useState } from 'react';
import Covid19DataStore, { LocationData } from '../../../store/Covid19DataStore';
import DataPage from '../../common/DataPage';
import { IMAGES, SETTINGS } from '../../../constants';
import { NumberParam } from 'use-query-params';
import CountryStateComparisonOptions from './CountryStateComparisonOptions';
import CountryStateComparisonChart from './CountryStateComparisonChart';
import useLocationSelection from '../../../hooks/useLocationSelection';
import { useAlwaysPresentQueryParam } from '../../../hooks/useAlwaysPresentQueryParam';
import { usePropertySelection } from '../../../hooks/usePropertySelection';
import _ from 'lodash';

interface CountryStateComparisonProps {
  store: Covid19DataStore
}

const CountryStateComparison: FunctionComponent<CountryStateComparisonProps> = ({ store }) => {
  const [locationsList] = useState(store.locations);
  const [data, setData] = useState<LocationData[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>();
  const [areChartAnimationsActive, setAreChartAnimationsActive] = useState(true);

  const [locations, locationInputComponent] = useLocationSelection(locationsList, [SETTINGS.defaultLocation], true);
  const [
    property,
    humanizedProperty,
    propertyInputComponent
  ] = usePropertySelection('property', 'confirmed', 'Compare');
  const [
    exceedingProperty,
    humanizedExceedingProperty,
    exceedingPropertyInputComponent
  ] = usePropertySelection('exceedingProperty', 'confirmed', 'Start from the day', true);
  const [exceedingValue, setExceedingValue] = useAlwaysPresentQueryParam(
    'exceedingValue',
    100,
    NumberParam,
  );

  const chartId = 'country-state-comparison-chart';
  const title = `COVID-19 ${_.startCase(humanizedProperty)} Comparison`;
  const pageDescription = `DRAFT`;

  useEffect(() => {
    const data = store.getDataByLocations(locations);
    const lastUpdated = store.lastUpdated;
    const strippedData = data.map(locationData =>
      Covid19DataStore.stripDataBeforePropertyExceedsN(locationData, exceedingProperty, exceedingValue),
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

  function handleExceedingValueChange(exceedingValueNew: number) {
    setExceedingValue(exceedingValueNew);
  }

  const optionsComponent = (
    <CountryStateComparisonOptions
      locationInputComponent={locationInputComponent}
      propertyInputComponent={propertyInputComponent}
      exceedingPropertyInputComponent={exceedingPropertyInputComponent}
      exceedingValue={exceedingValue}
      onExceedingValueChange={handleExceedingValueChange}
    />
  );

  const bodyComponent = (
    <CountryStateComparisonChart
      data={data}
      property={property}
      humanizedExceedingProperty={humanizedExceedingProperty}
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
