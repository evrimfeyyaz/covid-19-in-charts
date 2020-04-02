import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import CovidDataStore from './store/CovidDataStore';
import Spinner from 'react-bootstrap/Spinner';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import SingleLocationProgression from './components/SingleLocationProgression';
import { Switch, Route } from 'react-router-dom';
import { ROUTE_PATHS } from './constants';

function App() {
  const dataStore = useRef<CovidDataStore>(new CovidDataStore());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    dataStore.current.loadData().then(() => {
      setLoaded(true);
    });
  }, []);

  if (!loaded) {
    return (
      <div className='h-100 d-flex justify-content-center align-items-center'>
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#e1e6ed' }} className='h-100'>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand>COVID-19 in Charts</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="mr-auto">
              <NavDropdown title="Dropdown" id="nav-dropdown">
                <NavDropdown.Item href={ROUTE_PATHS.diseaseProgression}>
                  Disease Progression
                </NavDropdown.Item>
                <NavDropdown.Item>
                  Progression Comparison in Multiple Locations
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav className='ml-auto'>
              <Nav.Link>About</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className='py-4'>
        <Switch>
          <Route path={`${ROUTE_PATHS.diseaseProgression}`}>
            <SingleLocationProgression store={dataStore.current} />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default App;
