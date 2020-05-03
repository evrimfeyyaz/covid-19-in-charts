import React, { useEffect, useRef, useState } from 'react';
import Covid19DataStore from './store/Covid19DataStore';
import { IMAGES, SITE_INFO } from './constants';
import NavBar from './components/common/NavBar';
import Loading from './components/common/Loading';
import { Helmet } from 'react-helmet';
import { createPageTitle } from './utilities/metaUtilities';
import Footer from './components/common/Footer';
import Router from './components/pages/Router';
import ScreenTooSmall from './components/common/ScreenTooSmall';
import { getAbsoluteUrl } from './utilities/urlUtilities';
import { localStorageCleanup } from './utilities/localStorageUtilities';

function App() {
  const dataStore = useRef<Covid19DataStore>(new Covid19DataStore(handleLoadStatusChange));
  const [loaded, setLoaded] = useState(false);

  function handleLoadStatusChange(status: boolean, message: string) {
    console.log(message);
  }

  useEffect(() => {
    localStorageCleanup();

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
        <meta property="og:image" content={getAbsoluteUrl(IMAGES.og)} />
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
