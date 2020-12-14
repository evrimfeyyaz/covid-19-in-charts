import { COVID19API } from "@evrimfeyyaz/covid-19-api";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { cleanUp } from "./cleanUp";
import { Footer } from "./components/common/Footer";
import { Loading } from "./components/common/Loading";
import { NavBar } from "./components/common/NavBar";
import { ScreenTooSmall } from "./components/common/ScreenTooSmall";
import { Router } from "./components/pages/Router";
import { IMAGES, SITE_INFO } from "./constants";
import { createPageTitle } from "./utilities/metaUtilities";
import { getAbsoluteUrl } from "./utilities/urlUtilities";

export function App(): JSX.Element {
  const [loaded, setLoaded] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>();

  function handleLoadStatusChange(isLoading: boolean, message?: string): void {
    setLoaded(!isLoading);
    setLoadingMessage(message);
  }

  const dataStore = useMemo(
    () =>
      new COVID19API({
        onLoadingStatusChange: handleLoadStatusChange,
        store: "indexeddb",
      }),
    []
  );

  useEffect(() => {
    cleanUp();
  }, []);

  useEffect(() => {
    dataStore.init().catch(console.error);
  }, [dataStore]);

  const pageTitle = createPageTitle(SITE_INFO.baseTitle);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={SITE_INFO.description} />
        <meta property="og:url" content={SITE_INFO.baseUrl} />
        <meta property="og:image" content={getAbsoluteUrl(SITE_INFO.baseUrl, IMAGES.og)} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:site_name" content="COVID-19 in Charts" />
        <meta name="twitter:image:alt" content="COVID-19 in Charts" />
      </Helmet>

      {!loaded && <Loading message={loadingMessage} />}
      {loaded && (
        <>
          <NavBar />
          <Router dataStore={dataStore} />
          <ScreenTooSmall />
          <Footer />
        </>
      )}
    </>
  );
}
