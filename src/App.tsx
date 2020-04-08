import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import CovidDataStore from './store/CovidDataStore';
import SingleLocationProgression from './components/SingleLocationProgression';
import { Switch, Route } from 'react-router-dom';
import { ROUTE_PATHS } from './constants';
import NavBar from './components/NavBar';
import Loading from './components/Loading';
import { Helmet } from 'react-helmet';
import { createPageTitle } from './utilities/metaUtilities';
import Footer from './components/Footer';

function App() {
  const dataStore = useRef<CovidDataStore>(new CovidDataStore());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    dataStore.current.loadData().then(() => {
      setLoaded(true);
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>{createPageTitle()}</title>
      </Helmet>

      {!loaded && <Loading />}
      {loaded && (
        <>
          <NavBar />

          <div className='py-4'>
            <Switch>
              <Route path={`${ROUTE_PATHS.diseaseProgression}`}>
                <SingleLocationProgression store={dataStore.current} />
              </Route>
            </Switch>
          </div>

          <Footer />
        </>
      )}
    </>
  );
}

export default App;
