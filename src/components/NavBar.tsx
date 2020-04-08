import React, { FunctionComponent } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { EXTERNAL_LINKS, ROUTE_PATHS } from '../constants';
import { ReactComponent as GitHubMark } from '../images/github-mark.svg';
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
        <Navbar.Brand>COVID-19 in Charts</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="mr-auto">
            <NavDropdown title="Charts" id="nav-dropdown">
              <NavDropdown.Item {...createNavLinkProps(ROUTE_PATHS.diseaseProgression)}>
                Disease Progression
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav className='ml-auto'>
            <Nav.Link className='p-2' href={EXTERNAL_LINKS.gitHubRepo} target='_blank' rel='noopener noreferrer'>
              <GitHubMark height='1rem' width='1rem' className='align-top mt-1' />
            </Nav.Link>
            <Nav.Link>About</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
