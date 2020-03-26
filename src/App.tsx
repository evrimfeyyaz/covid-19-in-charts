import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import JHUCSSECovidDataStore, { LocationData } from './store/JHUCSSECovidDataStore';
import SingleLocationGraph from './components/SingleLocationGraph';
import MultiLocationGraph from './components/MultiLocationGraph';

function App() {
  const dataStore = useRef(new JHUCSSECovidDataStore());
  const [data, setData] = useState<LocationData | undefined>();
  const [data2, setData2] = useState<LocationData | undefined>();
  const [data3, setData3] = useState<LocationData | undefined>();

  useEffect(() => {
    dataStore.current.loadData().then(() => {
      console.log(dataStore.current.locations);
      setData(dataStore.current.getDataByLocation('Turkey', { stripDataBeforeOnset: true }));
      setData2(dataStore.current.getDataByLocation('US', { stripDataBeforeOnset: true }));
      setData3(dataStore.current.getDataByLocation('China (Total)', { stripDataBeforeOnset: true }));
    });
  }, []);

  if (data == null || data2 == null || data3 == null) {
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
      <MultiLocationGraph data={[data, data2, data3]} />
    </div>
  );
}

export default App;
