import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import CovidDataStore, { LocationData } from './store/CovidDataStore';
import Spinner from 'react-bootstrap/Spinner';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { Router } from '@reach/router';
import SingleLocationProgression from './components/SingleLocationProgression';

function App() {
  const dataStore = useRef<CovidDataStore>(new CovidDataStore());
  const [data, setData] = useState<LocationData | undefined>();

  useEffect(() => {
    dataStore.current.loadData().then(() => {
      let turkey = dataStore.current.getDataByLocation('Turkey');
      turkey = CovidDataStore.stripDataBeforeCasesExceedN(turkey, 10);
      setData(turkey);
    });
  }, []);

  if (data == null) {
    return (
      <div className='h-100 d-flex justify-content-center align-items-center'>
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand>COVID-19 in Charts</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="mr-auto">
              <NavDropdown title="Dropdown" id="nav-dropdown">
                <NavDropdown.Item href='/single-location-progression'>
                  Progression in Single Location
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

      <Router>
        <SingleLocationProgression store={dataStore.current} path='/single-location-progression' />
      </Router>
    </>
  );
}

export default App;
