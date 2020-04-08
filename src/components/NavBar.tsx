import React, { FunctionComponent } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { EXTERNAL_LINKS, ROUTE_PATHS } from '../constants';
import { useLocation } from 'react-router-dom';

const NavBar: FunctionComponent = () => {
  const { pathname } = useLocation();


  function createNavLinkProps(href: string) {
    let className = '';

    if (href === pathname) {
      className = 'active';
    }

    return { href, className };
  }

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href={ROUTE_PATHS.home}>COVID-19 in Charts</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="mr-auto">
            <Nav.Link {...createNavLinkProps(ROUTE_PATHS.diseaseProgression)}>
              Disease Progression
            </Nav.Link>
          </Nav>
          <Nav className='ml-auto'>
            <Nav.Link
              className='p-2' href={EXTERNAL_LINKS.gitHubRepo}
              target='_blank' rel='noopener noreferrer'
            >
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
