import React, { FunctionComponent, useEffect, useState } from 'react';
import CovidDataStore, { DateValues, LocationData } from '../../../store/CovidDataStore';
import CasesRecoveriesDeathsChart from './CasesRecoveriesDeathsChart';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { useQueryParam, StringParam, NumberParam } from 'use-query-params';
import CasesRecoveriesDeathsOptions, { ExceedingProperty } from './CasesRecoveriesDeathsOptions';
import { downloadNode } from '../../../utilities/nodeToImageUtilities';
import DataPage from '../../common/DataPage';
import { MDYStringToDate, prettifyDate } from '../../../utilities/dateUtilities';
import useSingleLocationSelection from '../../common/SingleLocationSelection/useSingleLocationSelection';
import { IMAGES } from '../../../constants';

interface CasesRecoveriesDeathsProps {
  store: CovidDataStore,
}

const CasesRecoveriesDeaths: FunctionComponent<CasesRecoveriesDeathsProps> = ({ store }) => {
  const [locations] = useState(store.locations);
  const [data, setData] = useState<LocationData>();
  const [lastUpdated, setLastUpdated] = useState<Date>();
  const [areChartAnimationsActive, setAreChartAnimationsActive] = useState(true);
  const [firstDate, setFirstDate] = useState<Date>();
  const [lastDate, setLastDate] = useState<Date>();

  const [location, locationInputComponent] = useSingleLocationSelection(locations);
  const [exceedingProperty = 'confirmed', setExceedingProperty] = useQueryParam('exceedingProperty', StringParam);
  const [exceedingValue = 100, setExceedingValue] = useQueryParam('exceedingValue', NumberParam);

  const chartId = 'cases-recoveries-deaths-chart';
  const title = `COVID-19 Cases, Recoveries & Deaths: ${location}`;
  const pageDescription = `See the number of confirmed cases, new cases, recoveries and deaths in ${location}.`;

  let subtitle = '';
  if (firstDate != null && lastDate != null) {
    subtitle = `${prettifyDate(firstDate)} — ${prettifyDate(lastDate)}`;
  }

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

    if (strippedData.values.length > 0) {
      const firstDate = MDYStringToDate(strippedData.values[0].date);
      const lastDate = MDYStringToDate(strippedData.values[strippedData.values.length - 1].date);

      setFirstDate(firstDate);
      setLastDate(lastDate);
    }

    setData(strippedData);
    setLastUpdated(lastUpdated);
  }, [store, location, exceedingProperty, exceedingValue]);

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
    <CasesRecoveriesDeathsOptions
      locationInputComponent={locationInputComponent}
      exceedingProperty={exceedingProperty as ExceedingProperty}
      exceedingValue={exceedingValue}
      onExceedingPropertyChange={handleExceedingPropertyChange}
      onExceedingValueChange={handleExceedingValueChange}
    />
  );

  const bodyComponent = (
    <CasesRecoveriesDeathsChart
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

export default CasesRecoveriesDeaths;
