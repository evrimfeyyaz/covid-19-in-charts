import React, { FunctionComponent } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";
import packageJson from "../../../package.json";
import { EXTERNAL_LINKS, ROUTE_PATHS } from "../../constants";

const Footer: FunctionComponent = () => {
  return (
    <footer className="bg-dark text-light pt-4 pb-2 mt-3 small text-center">
      <Container>
        <Row>
          <Col>
            <ul className="list-inline">
              <li className="list-inline-item mr-3">
                <Link to={ROUTE_PATHS.home} className="link footer-link">
                  Home
                </Link>
              </li>
              <li className="list-inline-item mr-3">
                <a href={EXTERNAL_LINKS.gitHubRepo} className="link footer-link">
                  GitHub
                </a>
              </li>
              <li className="list-inline-item">
                <Link to={ROUTE_PATHS.about} className="link footer-link">
                  About
                </Link>
              </li>
            </ul>
          </Col>
        </Row>
        <Row>
          <Col className="pt-2">
            <p>
              Created by{" "}
              <a className="footer-link" href={EXTERNAL_LINKS.authorWebsite}>
                Evrim Persembe
              </a>
              .
              <br />v{packageJson.version}
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
