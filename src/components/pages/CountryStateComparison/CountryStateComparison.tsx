import React, { FunctionComponent, useEffect, useState } from 'react';
import Covid19DataStore, { LocationData, ValuesOnDateProperty } from '../../../store/Covid19DataStore';
import DataPage from '../../common/DataPage';
import { IMAGES, SETTINGS } from '../../../constants';
import { NumberParam } from 'use-query-params';
import { ExceedingProperty } from '../CasesRecoveriesDeaths/CasesRecoveriesDeathsOptions';
import CountryStateComparisonOptions from './CountryStateComparisonOptions';
import CountryStateComparisonChart from './CountryStateComparisonChart';
import useLocationSelection from '../../../hooks/useLocationSelection';
import { ValuesOnDatePropertyParam } from '../../../utilities/useQueryParamsUtilities';
import { useAlwaysPresentQueryParam } from '../../../hooks/useAlwaysPresentQueryParam';

interface CountryStateComparisonProps {
  store: Covid19DataStore
}

const CountryStateComparison: FunctionComponent<CountryStateComparisonProps> = ({ store }) => {
  const [locationsList] = useState(store.locations);
  const [data, setData] = useState<LocationData[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>();
  const [areChartAnimationsActive, setAreChartAnimationsActive] = useState(true);

  const [locations, locationInputComponent] = useLocationSelection(locationsList, [SETTINGS.defaultLocation], true);
  const [property, setProperty] = useAlwaysPresentQueryParam(
    'property',
    'confirmed',
    ValuesOnDatePropertyParam,
  );
  const [exceedingProperty, setExceedingProperty] = useAlwaysPresentQueryParam(
    'exceedingProperty',
    'confirmed',
    ValuesOnDatePropertyParam,
  );
  const [exceedingValue, setExceedingValue] = useAlwaysPresentQueryParam(
    'exceedingValue',
    100,
    NumberParam,
  );

  const chartId = 'country-state-comparison-chart';
  const title = `COVID-19 ${property} Comparison`;
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

  function handlePropertyChange(propertyNew: ValuesOnDateProperty) {
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
