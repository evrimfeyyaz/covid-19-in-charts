import React, { FunctionComponent } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import { EXTERNAL_LINKS, ROUTE_PATHS, ROUTE_TITLES } from '../../constants';
import { getCurrentVersion } from '../../utilities/versionUtilities';

const Footer: FunctionComponent = () => {


  return (
    <footer className='bg-dark text-light pt-4 pb-2 mt-3 small text-center'>
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
          <Col className='pt-2 pb-2 pb-lg-0'>
            <h1 className='h6'>Visualizations</h1>
            <ul className='list-unstyled'>
              <li className='list-item mb-2 m-lg-1'>
                <Link to={ROUTE_PATHS.casesRecoveriesDeaths} className='link footer-link'>
                  {ROUTE_TITLES.casesRecoveriesDeaths}
                </Link>
              </li>
              <li className='list-item mb-2 m-lg-1'>
                <Link to={ROUTE_PATHS.dailyNumbers} className='link footer-link'>
                  {ROUTE_TITLES.dailyNumbers}
                </Link>
              </li>
              <li className='list-item mb-2 m-lg-1'>
                <Link to={ROUTE_PATHS.locationComparison} className='link footer-link'>
                  {ROUTE_TITLES.locationComparison}
                </Link>
              </li>
            </ul>
          </Col>
        </Row>
        <Row>
          <Col className='pt-2'>
            <p>
              Created by <a className='footer-link' href={EXTERNAL_LINKS.authorTwitter}>Evrim Persembe</a>.
              <br />
              v{getCurrentVersion()}
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
