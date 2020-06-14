import React, { FunctionComponent } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useLocation } from "react-router-dom";
import { EXTERNAL_LINKS, ROUTE_PATHS, SITE_INFO } from "../../constants";

/**
 * Top navigation bar.
 */
export const NavBar: FunctionComponent = () => {
  const { pathname } = useLocation();

  /**
   * Sets the `className` prop to include the active link class if the link is active.
   *
   * @param href The path that the link points to.
   * @param className The other CSS classes that the link should have.
   */
  function setCssClassIfActive(
    href: string,
    className?: string
  ): { href: string; className: string } {
    className = className ?? "";

    if (href === pathname) {
      className += " active";
    }

    return { href, className };
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href={ROUTE_PATHS.home}>{SITE_INFO.baseTitle}</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ml-auto">
            <Nav.Link href={EXTERNAL_LINKS.gitHubRepo} target="_blank" rel="noopener noreferrer">
              GitHub
            </Nav.Link>
            <Nav.Link {...setCssClassIfActive(ROUTE_PATHS.about)}>About</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
