import React, { FunctionComponent, useEffect, useState } from 'react';
import CovidDataStore, { DateValues, LocationData } from '../../store/CovidDataStore';
import CasesInLocationChart from './CasesInLocationChart';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useQueryParam, StringParam, NumberParam } from 'use-query-params';
import ShareButtons from '../ShareButtons';
import Loading from '../Loading';
import Helmet from 'react-helmet';
import { createPageTitle } from '../../utilities/metaUtilities';
import { useCanonicalURL } from '../../utilities/useCanonicalURL';
import CasesInLocationOptions, { ExceedingProperty } from './CasesInLocationOptions';
import { downloadRechartsChart } from '../../utilities/downloadChartUtilities';
import ShareAndDownload from '../ShareAndDownload';

interface CasesInLocationProps {
  store: CovidDataStore,
}

const CasesInLocation: FunctionComponent<CasesInLocationProps> = ({ store }) => {
  const canonicalUrl = useCanonicalURL();
  const defaultLocation = 'US';

  const [locations] = useState(store.locations);
  const [data, setData] = useState<LocationData>();
  const [lastUpdated, setLastUpdated] = useState<Date>();
  const [areChartAnimationsActive, setAreChartAnimationsActive] = useState(true);

  const [location = defaultLocation, setLocation] = useQueryParam('location', StringParam);
  const [exceedingProperty = 'confirmed', setExceedingProperty] = useQueryParam('exceedingProperty', StringParam);
  const [exceedingValue = 100, setExceedingValue] = useQueryParam('exceedingValue', NumberParam);

  const firstDate = data?.values?.[0]?.date;
  const lastDate = data?.values?.[data?.values?.length - 1]?.date;
  const chartId = 'cases-in-location';
  const title = `COVID-19 Cases, Recoveries & Deaths: ${location}`;

  useEffect(() => {
    const data = store.getDataByLocation(location);
    const lastUpdated = store.lastUpdated;
    const strippedData = CovidDataStore.stripDataBeforePropertyExceedsN(data, exceedingProperty, exceedingValue);

    setData(strippedData);
    setLastUpdated(lastUpdated);
  }, [store, location, exceedingProperty, exceedingValue]);

  function handleOptionsChange(locationNew: string, exceedingPropertyNew: ExceedingProperty, exceedingValueNew: number) {
    if (location !== locationNew) {
      setLocation(locationNew);
    }

    if (exceedingProperty !== exceedingPropertyNew) {
      setExceedingProperty(exceedingPropertyNew);
    }

    if (exceedingValue !== exceedingValueNew) {
      setExceedingValue(exceedingValueNew);
    }
  }

  function handleDownloadClick() {
    setAreChartAnimationsActive(false);
    const node = document.getElementById(chartId) as HTMLElement;
    downloadRechartsChart(node).finally(() => setAreChartAnimationsActive(true));
  }

  let body = <Loading />;

  if (data != null && lastUpdated != null) {
    body = (
      <Row>
        <Col xs={12} lg={4} className='d-flex flex-column px-4 py-3'>
          <CasesInLocationOptions locations={locations} location={location} defaultLocation={defaultLocation}
                                  exceedingProperty={exceedingProperty as ExceedingProperty}
                                  exceedingValue={exceedingValue}
                                  onValuesChange={handleOptionsChange} />
          <div className='mt-auto d-none d-lg-block'>
            <ShareAndDownload title={title} onDownloadClick={handleDownloadClick} smallButtons />
          </div>
        </Col>
        <Col>
          <div id={chartId}>
            <CasesInLocationChart
              title={title}
              data={data?.values as DateValues}
              lastUpdated={lastUpdated as Date}
              firstDate={firstDate}
              lastDate={lastDate}
              exceedingProperty={exceedingProperty}
              exceedingValue={exceedingValue}
              isAnimationActive={areChartAnimationsActive}
            />
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
  let pageDescription = `See the number of confirmed cases, new cases, recoveries and deaths in ${location}.`;

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

export default CasesInLocation;
