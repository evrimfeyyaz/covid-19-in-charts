import React, { FormEvent, FunctionComponent, useEffect, useState } from 'react';
import CovidDataStore, { LocationData } from '../store/CovidDataStore';
import SingleLocationProgressionChart from './SingleLocationProgressionChart';
import { RouteComponentProps } from '@reach/router';
import Spinner from 'react-bootstrap/Spinner';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

interface SingleLocationProgressionProps extends RouteComponentProps {
  store: CovidDataStore,
}

const SingleLocationProgression: FunctionComponent<SingleLocationProgressionProps> = ({ store }) => {
  const [locations] = useState(store.locations);
  const [selectedLocation, setSelectedLocation] = useState();
  const [casesExceed, setCasesExceed] = useState(10);
  const [data, setData] = useState<LocationData>();

  const [selectedLocationInputValue, setSelectedLocationInputValue] = useState<string[]>([]);
  const [casesExceedInputValue, setCasesExceedInputValue] = useState(casesExceed.toString());
  const [casesExceedError, setCasesExceedError] = useState();

  useEffect(() => {
    setSelectedLocationInputValue([locations[0]]);
  }, [locations]);

  useEffect(() => {
    if (selectedLocationInputValue.length === 0) {
      return;
    }

    setSelectedLocation(selectedLocationInputValue[0]);
  }, [selectedLocationInputValue]);

  useEffect(() => {
    if (casesExceedInputValue.match(/^\d+$/)) {
      setCasesExceed(parseInt(casesExceedInputValue));
      setCasesExceedError(undefined);
    } else {
      setCasesExceedError('Please enter a number.');
    }
  }, [casesExceedInputValue]);

  useEffect(() => {
    if (selectedLocation == null) {
      return;
    }

    const fullData = store.getDataByLocation(selectedLocation);
    const strippedData = CovidDataStore.stripDataBeforeCasesExceedN(fullData, casesExceed);

    setData(strippedData);
  }, [store, selectedLocation, casesExceed]);

  function handleLocationMenuBlur() {
    if (selectedLocationInputValue.length === 0) {
      setSelectedLocationInputValue([selectedLocation]);
    }
  }

  function handleCasesExceedChange(event: FormEvent<HTMLInputElement>) {
    setCasesExceedInputValue(event.currentTarget.value);
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
          <Form>
            <Form.Group>
              <Row>
                <Col>
                  <Form.Label>Country</Form.Label>
                  <Typeahead
                    id='location-selection'
                    options={locations}
                    placeholder="Select location..."
                    highlightOnlyResult
                    selectHintOnEnter
                    clearButton
                    onChange={setSelectedLocationInputValue}
                    onBlur={handleLocationMenuBlur}
                    selected={selectedLocationInputValue}
                    paginationText='Show more countries'
                  />
                </Col>
                <Col>
                  <Form.Label>Start When Cases Exceed</Form.Label>
                  <Form.Control
                    value={casesExceedInputValue}
                    onChange={handleCasesExceedChange}
                    isInvalid={!!casesExceedError}
                  />
                  <Form.Control.Feedback type="invalid">
                    {casesExceedError}
                  </Form.Control.Feedback>
                </Col>
              </Row>
            </Form.Group>
          </Form>
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
