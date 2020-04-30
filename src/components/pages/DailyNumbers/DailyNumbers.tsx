import React, { FunctionComponent, useEffect, useState } from 'react';
import Covid19DataStore, { ValuesOnDate } from '../../../store/Covid19DataStore';
import { downloadNode } from '../../../utilities/nodeToImageUtilities';
import DailyNumbersTable from './DailyNumbersTable';
import DataPage from '../../common/DataPage';
import { prettifyDate } from '../../../utilities/dateUtilities';
import { IMAGES, SETTINGS } from '../../../constants';
import useLocationSelection from '../../../hooks/useLocationSelection';
import { useDateSelection } from '../../../hooks/useDateSelection';

interface DailyNumbersProps {
  store: Covid19DataStore,
}

const DailyNumbers: FunctionComponent<DailyNumbersProps> = ({ store }) => {
  const [locationsList] = useState(store.locations);
  const [data, setData] = useState<ValuesOnDate>();
  const [lastUpdated, setLastUpdated] = useState<Date>();
  const [firstDate] = useState(store.firstDate);
  const [lastDate] = useState(store.lastDate);

  const [
    [location],
    locationInputComponent,
  ] = useLocationSelection(locationsList, [SETTINGS.defaultLocation]);
  const [
    date,
    dateInputComponent,
  ] = useDateSelection(firstDate, lastDate);

  const tableId = 'daily-numbers';
  const title = `COVID-19 Daily Numbers: ${location}`;
  const subtitle = (date != null || lastDate != null) ? prettifyDate(date ?? lastDate as Date) : '';
  const pageDescription = `See the daily COVID-19 data for ${location}.`;

  useEffect(() => {
    if (date != null) {
      const data = store.getDataByLocationAndDate(location, date);
      const lastUpdated = store.lastUpdated;

      setData(data);
      setLastUpdated(lastUpdated);
    }
  }, [store, location, date]);

  function handleDownloadClick() {
    const node = document.getElementById(tableId) as HTMLElement;
    downloadNode(node);
  }

  function hasLoaded() {
    return (
      data != null &&
      lastUpdated != null &&
      firstDate != null &&
      lastDate != null &&
      date != null
    );
  }

  const bodyComponent = (<DailyNumbersTable data={data} />);

  return (
    <DataPage
      title={title}
      subTitle={subtitle}
      pageDescription={pageDescription}
      ogImage={IMAGES.dailyNumbersOg}
      lastUpdated={lastUpdated as Date}
      hasLoaded={hasLoaded()}
      bodyComponent={bodyComponent}
      optionsComponents={[locationInputComponent, dateInputComponent]}
      dataContainerId={tableId}
      onDownloadClick={handleDownloadClick}
    />
  );
};

export default DailyNumbers;
