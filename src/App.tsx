import React, { useEffect, useRef, useState } from 'react';
import CovidDataStore from './store/CovidDataStore';
import { SITE_INFO } from './constants';
import NavBar from './components/common/NavBar';
import Loading from './components/common/Loading';
import { Helmet } from 'react-helmet';
import { createPageTitle } from './utilities/metaUtilities';
import Footer from './components/common/Footer';
import Router from './components/pages/Router';
import ScreenTooSmall from './components/common/ScreenTooSmall';
import { getAbsoluteUrl } from './utilities/urlUtilities';

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
        <meta property="og:image" content={getAbsoluteUrl('/og-image-8e97431a-e769-4e8d-a4a4-e91daa1e9d63.jpg')} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:site_name" content="COVID-19 in Charts" />
        <meta name="twitter:image:alt" content="COVID-19 in Charts" />
      </Helmet>

      {!loaded && <Loading />}
      {loaded && (
        <>
          <NavBar />
          <Router dataStore={dataStore.current} />
          <ScreenTooSmall />
          <Footer />
        </>
      )}
    </>
  );
}

export default App;
