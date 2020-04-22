import React, { FunctionComponent, useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Loading from '../Loading';
import { createPageTitle } from '../../utilities/metaUtilities';
import Container from 'react-bootstrap/Container';
import Helmet from 'react-helmet';
import { useCanonicalURL } from '../../utilities/useCanonicalURL';
import CovidDataStore, { DateValue } from '../../store/CovidDataStore';
import { StringParam, DateParam, useQueryParam } from 'use-query-params';
import { downloadNode } from '../../utilities/nodeToImageUtilities';
import ShareAndDownload from '../ShareAndDownload';
import DailyNumbersOptions from './DailyNumbersOptions';
import DailyNumbersTable from './DailyNumbersTable';

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

  const tableId = 'daily-numbers';
  const title = `COVID-19 Daily Numbers: ${location}`;

  useEffect(() => {
    // Set current query params in the URL, just in case they are missing.
    setLocation(location);
    setDate(date ?? lastDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastDate]);

  useEffect(() => {
    const firstDate = store.firstDate;
    const lastDate = store.lastDate;

    setFirstDate(firstDate);
    setLastDate(lastDate);

    if (date == null) {
      return;
    }

    const data = store.getDataByLocationAndDate(location, date);
    const lastUpdated = store.lastUpdated;

    setData(data);
    setLastUpdated(lastUpdated);
  }, [store, location, date]);

  function handleOptionsChange(locationNew: string, dateNew: Date) {
    if (location !== locationNew) {
      setLocation(locationNew);
    }

    if (date?.getTime() !== dateNew.getTime()) {
      setDate(dateNew);
    }
  }

  function handleDownloadClick() {
    const node = document.getElementById(tableId) as HTMLElement;
    downloadNode(node);
  }

  let body = <Loading />;

  if (data != null && lastUpdated != null && firstDate != null && lastDate != null && date != null) {
    body = (
      <Row>
        <Col xs={12} lg={4} className='d-flex flex-column px-4 py-3'>
          <DailyNumbersOptions
            locations={locations}
            location={location}
            defaultLocation={defaultLocation}
            date={date}
            minDate={firstDate}
            maxDate={lastDate}
            onValuesChange={handleOptionsChange} />
          <div className='mt-auto d-none d-lg-block'>
            <ShareAndDownload title={title} onDownloadClick={handleDownloadClick} smallButtons />
          </div>
        </Col>
        <Col>
          <div id={tableId}>
            <DailyNumbersTable date={date} title={title} lastUpdated={lastUpdated} data={data} />
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
