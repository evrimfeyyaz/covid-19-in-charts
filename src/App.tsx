import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import CovidDataStore from './store/CovidDataStore';
import Spinner from 'react-bootstrap/Spinner';
import SingleLocationProgression from './components/SingleLocationProgression';
import { Switch, Route } from 'react-router-dom';
import { ROUTE_PATHS } from './constants';
import NavBar from './components/NavBar';

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
      <NavBar />

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
