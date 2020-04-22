import React, { FunctionComponent, useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Loading from '../Loading';
import { createPageTitle } from '../../utilities/metaUtilities';
import Container from 'react-bootstrap/Container';
import Helmet from 'react-helmet';
import { useCanonicalURL } from '../../utilities/useCanonicalURL';
import CovidDataStore, { DateValue } from '../../store/CovidDataStore';
import { StringParam, DateParam, BooleanParam, useQueryParam } from 'use-query-params';
import { downloadNode } from '../../utilities/nodeToImageUtilities';
import ShareAndDownload from '../ShareAndDownload';
import DailyNumbersOptions from './DailyNumbersOptions';
import DailyNumbersTable from './DailyNumbersTable';
import { isSameDay } from 'date-fns';

interface DailyNumbersProps {
  store: CovidDataStore,
}

const DailyNumbers: FunctionComponent<DailyNumbersProps> = ({ store }) => {
  const canonicalUrl = useCanonicalURL();
  const defaultLocation = 'US';

  const [locations] = useState(store.locations);
  const [data, setData] = useState<DateValue>();
  const [lastUpdated, setLastUpdated] = useState<Date>();
  const [firstDate, setFirstDate] = useState<Date>();
  const [lastDate, setLastDate] = useState<Date>();

  const [location = defaultLocation, setLocation] = useQueryParam('location', StringParam);
  const [date, setDate] = useQueryParam('date', DateParam);
  const [latest, setLatest] = useQueryParam('latest', BooleanParam);

  const tableId = 'daily-numbers';
  const title = `COVID-19 Daily Numbers: ${location}`;

  useEffect(() => {
    // Set current query params in the URL, just in case they are missing.
    setLocation(location);
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

  function handleLocationChange(locationNew: string) {
    setLocation(locationNew);
  }

  function handleDateChange(dateNew: Date) {
    if (lastDate && isSameDay(dateNew, lastDate)) {
      setDate(undefined);
      setLatest(true);
    } else {
      setDate(dateNew)
      setLatest(undefined);
    }
  }

  function handleDownloadClick() {
    const node = document.getElementById(tableId) as HTMLElement;
    downloadNode(node);
  }

  let body = <Loading />;

  if (data != null && lastUpdated != null && firstDate != null && lastDate != null && (date != null || latest != null)) {
    const dateToUse = (latest ? lastDate : date) as Date;

    body = (
      <Row>
        <Col xs={12} lg={4} className='d-flex flex-column px-4 py-3'>
          <DailyNumbersOptions
            locations={locations}
            location={location}
            date={dateToUse}
            minDate={firstDate}
            maxDate={lastDate}
            onLocationChange={handleLocationChange}
            onDateChange={handleDateChange}
          />
          <div className='mt-auto d-none d-lg-block'>
            <ShareAndDownload title={title} onDownloadClick={handleDownloadClick} smallButtons />
          </div>
        </Col>
        <Col>
          <div id={tableId}>
            <DailyNumbersTable date={dateToUse} title={title} lastUpdated={lastUpdated} data={data} />
          </div>
        </Col>
        <Row className='d-lg-none mt-3'>
          <Col className='px-5'>
            <ShareAndDownload title={title} onDownloadClick={handleDownloadClick} />
          </Col>
        </Row>
      </Row>
    );
  }

  const pageTitle = createPageTitle(title);
  let pageDescription = `See the daily COVID-19 data for ${location}.`;

  return (
    <Container>
      <Helmet>
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
      </Helmet>
      {body}
    </Container>
  );
};

export default DailyNumbers;
