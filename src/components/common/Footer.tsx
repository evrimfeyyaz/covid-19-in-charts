import React, { FunctionComponent } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import packageJson from "../../../package.json";
import { EXTERNAL_LINKS, ROUTE_PATHS } from "../../constants";

/**
 * Page footer. Shown on all pages.
 */
export const Footer: FunctionComponent = () => {
  return (
    <Navbar bg="dark" variant="dark" as="footer" className="pt-4 pb-5">
      <Container>
        <Nav as="ul" bg={"dark"}>
          <Nav.Item as="li" className="mr-4">
            <Nav.Link href={ROUTE_PATHS.home}>Home</Nav.Link>
          </Nav.Item>
          <Nav.Item as="li" className="mr-4">
            <Nav.Link href={EXTERNAL_LINKS.gitHubRepo}>GitHub</Nav.Link>
          </Nav.Item>
          <Nav.Item as="li">
            <Nav.Link href={ROUTE_PATHS.about}>About</Nav.Link>
          </Nav.Item>
        </Nav>

        <div className="text-light">
          Created by{" "}
          <a href={EXTERNAL_LINKS.authorWebsite} className="text-warning">
            Evrim Persembe
          </a>
          <span className="text-secondary ml-4">v{packageJson.version}</span>
        </div>
      </Container>
    </Navbar>
  );
};
