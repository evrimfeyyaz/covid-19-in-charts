import React, { FunctionComponent } from 'react';
import { createPageTitle } from '../../utilities/metaUtilities';
import Container from 'react-bootstrap/Container';
import Helmet from 'react-helmet';
import { useCanonicalURL } from '../../hooks/useCanonicalURL';
import Loading from './Loading';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ShareAndDownload from './ShareAndDownload';
import Card from 'react-bootstrap/Card';
import { getAbsoluteUrl } from '../../utilities/urlUtilities';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';

interface DataPageProps {
  title: string,
  subTitle?: string,
  pageDescription: string,
  ogImage: string,
  lastUpdated: Date,
  hasLoaded: boolean,
  bodyComponent: JSX.Element,
  optionsComponents: JSX.Element[],
  advancedOptionsComponents?: JSX.Element[],
  dataContainerId: string,
  onDownloadClick: () => void,
}

const DataPage: FunctionComponent<DataPageProps> = ({
                                                      title, subTitle, pageDescription, hasLoaded,
                                                      bodyComponent, optionsComponents,
                                                      advancedOptionsComponents, lastUpdated,
                                                      ogImage, dataContainerId, onDownloadClick,
                                                    }) => {
  const canonicalUrl = useCanonicalURL();

  let body = <Loading />;
  if (hasLoaded) {
    body = (
      <Row>
        <Col xs={12} lg={4} className='d-flex flex-column px-4 py-3'>
          {optionsComponents}
          {advancedOptionsComponents && advancedOptionsComponents.length > 0 && (
            <Accordion>
              <Accordion.Toggle as={Button} variant="link" eventKey="0" className='w-100'>
                More Options
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0" className='py-2'>
                <Card className='bg-transparent border-white'>
                  <Card.Body>
                    {advancedOptionsComponents.map(component => (
                      <Row>
                        <Col xs={12}>
                          {component}
                        </Col>
                      </Row>
                    ))}
                  </Card.Body>
                </Card>
              </Accordion.Collapse>
            </Accordion>
          )}
          <div className='mt-auto d-none d-lg-block'>
            <ShareAndDownload title={title} onDownloadClick={onDownloadClick} smallButtons />
          </div>
        </Col>
        <Col>
          <div id={dataContainerId}>
            <h1 className='h4 mb-1'>{title}</h1>
            {subTitle && (
              <p className='small text-muted ml-1'>{subTitle}</p>
            )}
            <Card className='shadow border-0 mt-3' style={{ borderRadius: 15 }}>
              <Card.Body className='px-4 py-4'>
                {bodyComponent}
                <p className='text-center my-0 font-weight-light font-italic text-muted'>
                  <small>
                    covid19incharts.com | source: <a className='text-decoration-none'
                                                     href='https://github.com/CSSEGISandData/COVID-19'>JHU CSSE</a> |
                    last
                    updated: {lastUpdated.toUTCString()}
                  </small>
                </p>
              </Card.Body>
            </Card>
          </div>
        </Col>
        <Row className='d-lg-none mt-3'>
          <Col className='px-5'>
            <ShareAndDownload title={title} onDownloadClick={onDownloadClick} />
          </Col>
        </Row>
      </Row>
    );
  }

  const pageTitle = createPageTitle(title);

  return (
    <Container>
      <Helmet>
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={getAbsoluteUrl(ogImage)} />
        <meta name="twitter:image:alt" content={pageTitle} />
      </Helmet>
      {body}
    </Container>
  );
};

export default DataPage;
