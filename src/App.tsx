import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import LocationDataFromOnsetGraph from './components/LocationDataFromOnsetGraph';
import JHUCSSECovidDataStore, { LocationData } from './store/JHUCSSECovidDataStore';

function App() {
  const dataStore = useRef(new JHUCSSECovidDataStore());
  const [data, setData] = useState<LocationData | undefined>();

  useEffect(() => {
    dataStore.current.loadData().then(() => {
      setData(dataStore.current.getCasesDataByLocation('Turkey'));
    });
  }, []);

  if (data == null) {
    return (
      <div>
        <p>
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div>
      <LocationDataFromOnsetGraph data={data.values} />
    </div>
  );
}

export default App;
