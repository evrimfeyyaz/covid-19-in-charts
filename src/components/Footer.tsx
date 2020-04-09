import React, { FunctionComponent } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import { EXTERNAL_LINKS, ROUTE_PATHS } from '../constants';
import Nav from 'react-bootstrap/Nav';

const Footer: FunctionComponent = () => {
  return (
    <footer className='bg-dark text-light pt-4 pb-3 mt-3 small text-center'>
      <Container>
        <Row>
          <Col>
            <ul className='list-inline'>
              <li className='list-inline-item mr-3'>
                <Link to={ROUTE_PATHS.home} className='link footer-link'>
                  Home
                </Link>
              </li>
              <li className='list-inline-item mr-3'>
                <a href={EXTERNAL_LINKS.gitHubRepo} className='link footer-link'>
                  GitHub
                </a>
              </li>
              <li className='list-inline-item'>
                <Link to={ROUTE_PATHS.about} className='link footer-link'>
                  About
                </Link>
              </li>
            </ul>
          </Col>
        </Row>
        <Row>
          <Col className='pt-2'>
            <h1 className='h6'>Charts</h1>
            <ul className='list-inline'>
              <li className='list-inline-item'>
                <Link to={ROUTE_PATHS.casesInLocation} className='link footer-link'>
                  Cases, Recoveries & Deaths
                </Link>
              </li>
            </ul>
          </Col>
        </Row>
        <Row>
          <Col className='pt-2'>
            Created by <a className='footer-link' href={EXTERNAL_LINKS.authorTwitter}>Evrim Persembe</a>.
          </Col>
        </Row>
      </Container>
    </footer>
  )
};

export default Footer;
