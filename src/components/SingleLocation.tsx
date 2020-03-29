import React, { FunctionComponent, useEffect, useState } from 'react';
import CovidDataStore from '../store/CovidDataStore';

interface SingleLocationProps {
  store: CovidDataStore,
}

const SingleLocation: FunctionComponent<SingleLocationProps> = ({ store }) => {
  const [locations] = useState(store.locations);
  const [selectedLocation, setSelectedLocation] = useState();
  const [data, setData] = useState();

  useEffect(() => {
    setSelectedLocation(locations[0]);
  }, [locations]);

  useEffect(() => {
    setData(store.getDataByLocation(selectedLocation));
  }, [store, selectedLocation]);

  return (
    <div>

    </div>
  )
};

export default SingleLocation;
