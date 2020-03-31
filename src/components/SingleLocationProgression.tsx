import React, { FunctionComponent, useEffect, useState } from 'react';
import CovidDataStore, { LocationData } from '../store/CovidDataStore';
import SingleLocationProgressionChart from './SingleLocationProgressionChart';
import { RouteComponentProps } from '@reach/router';
import Spinner from 'react-bootstrap/Spinner';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

interface SingleLocationProgressionProps extends RouteComponentProps {
  store: CovidDataStore,
}

const SingleLocationProgression: FunctionComponent<SingleLocationProgressionProps> = ({ store }) => {
  const [locations] = useState(store.locations);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState();
  const [data, setData] = useState<LocationData>();

  useEffect(() => {
    setSelectedLocations([locations[0]]);
  }, [locations]);

  useEffect(() => {
    if (selectedLocations.length === 0) {
      return;
    }

    setSelectedLocation(selectedLocations[0]);
  }, [selectedLocations]);

  useEffect(() => {
    if (selectedLocation == null) {
      return;
    }

    const fullData = store.getDataByLocation(selectedLocation);
    const strippedData = CovidDataStore.stripDataBeforeCasesExceedsN(fullData, 10);

    setData(strippedData);
  }, [store, selectedLocation]);

  function handleLocationMenuBlur() {
    if (selectedLocations.length === 0) {
      setSelectedLocations([selectedLocation]);
    }
  }

  if (data == null) {
    return (
      <div className='h-100 d-flex justify-content-center align-items-center'>
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container>
      <Row>
        <Col>
          <Typeahead
            id='location-selection'
            options={locations}
            placeholder="Select location..."
            highlightOnlyResult
            selectHintOnEnter
            clearButton
            onChange={setSelectedLocations}
            onBlur={handleLocationMenuBlur}
            selected={selectedLocations}
            paginationText='Show more countries'
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <SingleLocationProgressionChart data={data.values} />
        </Col>
      </Row>
    </Container>
  );
};

export default SingleLocationProgression;
