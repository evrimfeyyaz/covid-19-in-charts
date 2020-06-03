import React, { FunctionComponent } from "react";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Helmet from "react-helmet";
import { useCanonicalURL } from "../../hooks/useCanonicalURL";
import { createPageTitle } from "../../utilities/metaUtilities";
import { getAbsoluteUrl } from "../../utilities/urlUtilities";
import Loading from "./Loading";
import ShareButtons from "./ShareButtons";

interface DataPageProps {
  title: string;
  subTitle?: string;
  pageDescription: string;
  ogImage: string;
  lastUpdated: Date;
  hasLoaded: boolean;
  bodyComponent: JSX.Element;
  optionsComponents: JSX.Element[];
  advancedOptionsComponents?: JSX.Element[];
  dataContainerId: string;
  canonicalQueryParams?: string[];
}

const DataPage: FunctionComponent<DataPageProps> = ({
  title,
  subTitle,
  pageDescription,
  hasLoaded,
  bodyComponent,
  optionsComponents,
  canonicalQueryParams,
  advancedOptionsComponents,
  lastUpdated,
  ogImage,
  dataContainerId,
}) => {
  const canonicalUrl = useCanonicalURL(canonicalQueryParams);

  let body = <Loading />;
  if (hasLoaded) {
    body = (
      <Row>
        <Col xs={12} lg={4} className="d-flex flex-column px-4 py-3">
          {optionsComponents.map((component, index) => (
            <div key={`options-component-${index}`}>{component}</div>
          ))}
          {advancedOptionsComponents && advancedOptionsComponents.length > 0 && (
            <Accordion>
              <Accordion.Toggle as={Button} variant="link" eventKey="0" className="w-100">
                More Options
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0" className="py-2">
                <Card className="bg-transparent border-white">
                  <Card.Body>
                    {advancedOptionsComponents.map((component, index) => (
                      <Row key={`advanced-options-component-${index}`}>
                        <Col xs={12}>{component}</Col>
                      </Row>
                    ))}
                  </Card.Body>
                </Card>
              </Accordion.Collapse>
            </Accordion>
          )}
          <div className="mt-auto d-none d-lg-block">
            <ShareButtons title={title} url={window.location.href} small />
          </div>
        </Col>
        <Col>
          <div id={dataContainerId}>
            <h1 className="h4 mb-1">{title}</h1>
            {subTitle && <p className="small text-muted ml-1">{subTitle}</p>}
            <Card className="shadow border-0 mt-3" style={{ borderRadius: 15 }}>
              <Card.Body className="px-4 py-4">
                {bodyComponent}
                <p className="text-center my-0 font-weight-light font-italic text-muted">
                  <small>
                    covid19incharts.com | source:{" "}
                    <a
                      className="text-decoration-none"
                      href="https://github.com/CSSEGISandData/COVID-19"
                    >
                      JHU CSSE
                    </a>{" "}
                    | last updated: {lastUpdated.toUTCString()}
                  </small>
                </p>
              </Card.Body>
            </Card>
          </div>
        </Col>
        <Row className="d-lg-none mt-3">
          <Col className="px-5">
            <ShareButtons title={title} url={window.location.href} />
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
