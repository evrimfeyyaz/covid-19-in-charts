import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import JHUCSSECovidDataStore, { LocationData } from './store/JHUCSSECovidDataStore';
import SingleLocationGraph from './components/SingleLocationGraph';

function App() {
  const dataStore = useRef(new JHUCSSECovidDataStore());
  const [data, setData] = useState<LocationData | undefined>();

  useEffect(() => {
    dataStore.current.loadData().then(() => {
      setData(dataStore.current.getDataByLocation('Turkey', { stripDataBeforeOnset: true }));
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
      <SingleLocationGraph data={data.values} />
    </div>
  );
}

export default App;
