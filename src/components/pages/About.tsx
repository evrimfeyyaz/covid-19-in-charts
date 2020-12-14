import { FunctionComponent } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Helmet } from "react-helmet";
import { EXTERNAL_LINKS, ROUTE_PATHS, SITE_INFO } from "../../constants";
import { createPageTitle } from "../../utilities/metaUtilities";
import { getAbsoluteUrl } from "../../utilities/urlUtilities";

/**
 * About page.
 */
export const About: FunctionComponent = () => {
  const pageTitle = createPageTitle(SITE_INFO.baseTitle, "About");
  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} />
        <meta property="og:url" content={getAbsoluteUrl(SITE_INFO.baseUrl, ROUTE_PATHS.about)} />
      </Helmet>

      <Container>
        <Row>
          <Col xs={{ span: 10, offset: 1 }} lg={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
            <h1 className="h3">About COVID-19 in Charts</h1>
            <p>
              This website uses the{" "}
              <a href="https://github.com/CSSEGISandData/COVID-19">
                data provided by the Johns Hopkins University Center for Systems Science and
                Engineering (JHU CSSE)
              </a>
              . This data isn't perfect, for that reason, I wouldn't recommend using this website in
              any official manner.
            </p>

            <p>
              The source code of this website is open-source. You can{" "}
              <a href={EXTERNAL_LINKS.gitHubRepo}>view the repository on GitHub</a>.
            </p>

            <p>
              If you have any suggestions or comments, feel free to send them to{" "}
              <a href={`mailto:${EXTERNAL_LINKS.feedbackEmail}`}>{EXTERNAL_LINKS.feedbackEmail}</a>.
            </p>
            <Card>
              <Card.Body>
                <Card.Title>Looking for a web or mobile app developer?</Card.Title>
                <Card.Text>
                  If you are looking for a web or mobile app developer, I might be available for
                  freelance work. You can{" "}
                  <a href={EXTERNAL_LINKS.authorWebsite}>find out more about me on my website</a>.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};
