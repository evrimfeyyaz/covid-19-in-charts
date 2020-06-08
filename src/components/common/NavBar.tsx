import React, { FunctionComponent } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useLocation } from "react-router-dom";
import { EXTERNAL_LINKS, ROUTE_PATHS } from "../../constants";

const NavBar: FunctionComponent = () => {
  const { pathname } = useLocation();

  function createNavLinkProps(href: string): { href: string; className: string } {
    let className = "";

    if (href === pathname) {
      className = "active";
    }

    return { href, className };
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href={ROUTE_PATHS.home}>COVID-19 in Charts</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ml-auto">
            <Nav.Link href={EXTERNAL_LINKS.gitHubRepo} target="_blank" rel="noopener noreferrer">
              GitHub
            </Nav.Link>
            <Nav.Link {...createNavLinkProps(ROUTE_PATHS.about)}>About</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
