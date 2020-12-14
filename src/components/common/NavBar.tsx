import { FunctionComponent } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { EXTERNAL_LINKS, ROUTE_PATHS, SITE_INFO } from "../../constants";

/**
 * Top navigation bar.
 */
export const NavBar: FunctionComponent = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to={ROUTE_PATHS.home}>
          {SITE_INFO.baseTitle}
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ml-auto">
            <Nav.Link href={EXTERNAL_LINKS.gitHubRepo} target="_blank" rel="noopener noreferrer">
              GitHub
            </Nav.Link>
            <Nav.Link as={Link} to={ROUTE_PATHS.about}>
              About
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
