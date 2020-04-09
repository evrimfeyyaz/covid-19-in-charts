import React, { useEffect, useRef, useState } from 'react';
import CovidDataStore from './store/CovidDataStore';
import CasesInLocation from './components/CasesInLocation';
import { Switch, Route } from 'react-router-dom';
import { ROUTE_PATHS, SITE_INFO } from './constants';
import NavBar from './components/NavBar';
import Loading from './components/Loading';
import { Helmet } from 'react-helmet';
import { createPageTitle } from './utilities/metaUtilities';
import Footer from './components/Footer';
import ChartsIndex from './components/ChartsIndex';
import About from './components/About';

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
        <meta property="og:title" content={createPageTitle()} />
        <meta property="og:description" content={SITE_INFO.description} />
        <meta property="og:url" content={SITE_INFO.baseUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:site_name" content="COVID-19 in Charts" />
        <meta name="twitter:image:alt" content="COVID-19 in Charts" />
      </Helmet>

      {!loaded && <Loading />}
      {loaded && (
        <>
          <NavBar />

          <div className='py-4'>
            <Switch>
              <Route path={ROUTE_PATHS.casesInLocation}>
                <CasesInLocation store={dataStore.current} />
              </Route>
              <Route path={ROUTE_PATHS.about}>
                <About />
              </Route>
              <Route path={ROUTE_PATHS.home}>
                <ChartsIndex />
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
