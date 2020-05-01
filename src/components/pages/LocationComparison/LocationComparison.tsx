import React, { FunctionComponent, useEffect, useState } from 'react';
import Covid19DataStore, { LocationData } from '../../../store/Covid19DataStore';
import DataPage from '../../common/DataPage';
import { IMAGES, SETTINGS } from '../../../constants';
import LocationComparisonChart from './LocationComparisonChart';
import useLocationSelection from '../../../hooks/useLocationSelection';
import { usePropertySelection } from '../../../hooks/usePropertySelection';
import _ from 'lodash';
import { useNumberSelection } from '../../../hooks/useNumberSelection';

interface LocationComparisonProps {
  store: Covid19DataStore
}

const LocationComparison: FunctionComponent<LocationComparisonProps> = ({ store }) => {
  const [locationsList] = useState(store.locations);
  const [data, setData] = useState<LocationData[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>();
  const [areChartAnimationsActive, setAreChartAnimationsActive] = useState(true);

  const [
    locations,
    locationInputComponent]
    = useLocationSelection(locationsList, [SETTINGS.defaultLocation], true);
  const [
    property,
    humanizedProperty,
    propertyInputComponent,
  ] = usePropertySelection('property', 'confirmed', 'Compare');
  const [
    exceedingProperty,
    humanizedExceedingProperty,
    exceedingPropertyInputComponent,
  ] = usePropertySelection('exceedingProperty', 'confirmed', 'Start from the day', true);
  const [
    exceedingValue,
    exceedingValueInputComponent,
  ] = useNumberSelection('exceedingValue', 100, 'exceeded');

  const chartId = 'location-comparison-chart';
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
      ogImage={IMAGES.casesRecoveriesDeathsOg}
      lastUpdated={lastUpdated as Date}
      hasLoaded={hasLoaded()}
      bodyComponent={bodyComponent}
      optionsComponents={[locationInputComponent, propertyInputComponent]}
      advancedOptionsComponents={[exceedingPropertyInputComponent, exceedingValueInputComponent]}
      dataContainerId={chartId}
      onDownloadClick={handleDownloadClick}
    />
  );
};

export default LocationComparison;
