import { FunctionComponent } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";
import packageJson from "../../../package.json";
import { EXTERNAL_LINKS, ROUTE_PATHS } from "../../constants";

/**
 * Page footer. Shown on all pages.
 */
export const Footer: FunctionComponent = () => {
  return (
    <Navbar bg="dark" as="footer" variant="dark" className="pt-4 pb-4">
      <Container className="w-100 flex-wrap justify-content-center">
        <Row className="w-100 align-items-baseline">
          <Col xs={12} md={6}>
            <Nav as="ul" className="justify-content-center justify-content-md-start">
              <Nav.Item as="li" className="mr-4">
                <Nav.Link as={Link} to={ROUTE_PATHS.home}>
                  Home
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li" className="mr-4">
                <Nav.Link
                  href={EXTERNAL_LINKS.gitHubRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link as={Link} to={ROUTE_PATHS.about}>
                  About
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>

          <Col xs={12} md={6}>
            <div className="text-light text-center text-md-right mt-5 mt-md-0">
              Created by{" "}
              <a href={EXTERNAL_LINKS.authorWebsite} className="text-warning">
                Evrim Persembe
              </a>
              <span className="text-secondary ml-4">v{packageJson.version}</span>
            </div>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};
