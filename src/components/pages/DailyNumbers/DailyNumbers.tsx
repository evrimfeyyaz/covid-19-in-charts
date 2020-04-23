import React, { FunctionComponent, useEffect, useState } from 'react';
import CovidDataStore, { DateValue } from '../../../store/CovidDataStore';
import { DateParam, BooleanParam, useQueryParam } from 'use-query-params';
import { downloadNode } from '../../../utilities/nodeToImageUtilities';
import DailyNumbersOptions from './DailyNumbersOptions';
import DailyNumbersTable from './DailyNumbersTable';
import { isSameDay } from 'date-fns';
import DataPage from '../../common/DataPage';
import { prettifyDate } from '../../../utilities/dateUtilities';
import useSingleLocationSelection from '../../common/SingleLocationSelection/useSingleLocationSelection';

interface DailyNumbersProps {
  store: CovidDataStore,
}

const DailyNumbers: FunctionComponent<DailyNumbersProps> = ({ store }) => {
  const [locations] = useState(store.locations);
  const [data, setData] = useState<DateValue>();
  const [lastUpdated, setLastUpdated] = useState<Date>();
  const [firstDate, setFirstDate] = useState<Date>();
  const [lastDate, setLastDate] = useState<Date>();

  const [location, locationInputComponent] = useSingleLocationSelection(locations);
  const [date, setDate] = useQueryParam('date', DateParam);
  const [latest, setLatest] = useQueryParam('latest', BooleanParam);

  const tableId = 'daily-numbers';
  const title = `COVID-19 Daily Numbers: ${location}`;
  const subtitle = (date != null || lastDate != null) ? prettifyDate(date ?? lastDate as Date) : '';
  const pageDescription = `See the daily COVID-19 data for ${location}.`;

  useEffect(() => {
    // Set current query params in the URL, just in case they are missing.
    if (date == null) {
      setLatest(true);
    } else {
      setDate(date);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const firstDate = store.firstDate;
    const lastDate = store.lastDate;

    setFirstDate(firstDate);
    setLastDate(lastDate);

    let dateToUse: Date;
    if (latest) {
      dateToUse = lastDate;
    } else if (date != null) {
      dateToUse = date;
    } else {
      dateToUse = lastDate;
    }

    const data = store.getDataByLocationAndDate(location, dateToUse);
    const lastUpdated = store.lastUpdated;

    setData(data);
    setLastUpdated(lastUpdated);
  }, [store, location, date, latest]);

  function handleDateChange(dateNew: Date) {
    if (lastDate && isSameDay(dateNew, lastDate)) {
      setDate(undefined);
      setLatest(true);
    } else {
      setDate(dateNew);
      setLatest(undefined);
    }
  }

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
      (date != null || latest != null)
    );
  }

  const dateToUse = (latest ? lastDate : date) as Date;
  const bodyComponent = (<DailyNumbersTable data={data} />);

  const optionsComponent = (
    <DailyNumbersOptions
      locationInputComponent={locationInputComponent}
      date={dateToUse}
      minDate={firstDate as Date}
      maxDate={lastDate as Date}
      onDateChange={handleDateChange}
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
      dataContainerId={tableId}
      onDownloadClick={handleDownloadClick}
    />
  );
};

export default DailyNumbers;
