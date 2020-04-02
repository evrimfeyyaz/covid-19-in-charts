import React, { FormEvent, FunctionComponent, useEffect, useState } from 'react';
import CovidDataStore, { LocationData } from '../store/CovidDataStore';
import SingleLocationProgressionChart from './SingleLocationProgressionChart';
import Spinner from 'react-bootstrap/Spinner';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import domtoimage from 'dom-to-image';
import FileSaver from 'file-saver';
import { useQueryParam, StringParam, NumberParam } from 'use-query-params';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

interface SingleLocationProgressionProps {
  store: CovidDataStore,
}

interface InputValues {
  selectedLocations: string[],
  casesExceed: string
}

interface InputErrors {
  selectedLocations: string[],
  casesExceed: string[]
}

function validateInputs(selectedLocations: string[], casesExceed: string): InputErrors {
  let errors: InputErrors = {
    casesExceed: [],
    selectedLocations: [],
  };

  if (casesExceed.match(/^\d+$/)) {
    errors.casesExceed = [];
  } else {
    errors.casesExceed = ['Please enter a number.'];
  }

  console.log(`selected locations length in validation: ${selectedLocations.length}`);
  if (selectedLocations.length === 0) {
    errors.selectedLocations = ['No location selected.'];
  } else {
    errors.selectedLocations = [];
  }

  return errors;
}

const SingleLocationProgression: FunctionComponent<SingleLocationProgressionProps> = ({ store }) => {
  const [locations] = useState(store.locations);
  const [data, setData] = useState<LocationData>();

  const [location = 'Turkey', setLocation] = useQueryParam('location', StringParam);
  const [casesExceed = 10, setCasesExceed] = useQueryParam('casesExceed', NumberParam);

  const [inputValues, setInputValues] = useState<InputValues>({
    selectedLocations: [location.toString()],
    casesExceed: casesExceed.toString(),
  });
  const [inputErrors, setInputErrors] = useState<InputErrors>({
    selectedLocations: [],
    casesExceed: [],
  });

  useEffect(() => {
    const { selectedLocations, casesExceed } = inputValues;
    const errors = validateInputs(selectedLocations, casesExceed);
    setInputErrors(errors);

    if (errors.casesExceed.length === 0 && errors.selectedLocations.length === 0) {
      const casesExceedNum = parseInt(casesExceed);
      const selectedLocation = inputValues.selectedLocations[0];

      const data = store.getDataByLocation(selectedLocation);
      const strippedData = CovidDataStore.stripDataBeforeCasesExceedN(data, casesExceedNum);

      setData(strippedData);
      setLocation(selectedLocation);
      setCasesExceed(casesExceedNum);
    }
  }, [store, inputValues, setLocation, setCasesExceed]);

  function handleLocationMenuBlur() {
    if (inputValues.selectedLocations.length === 0) {
      setInputValues({ ...inputValues, selectedLocations: [location] });
    }
  }

  function handleCasesExceedChange(event: FormEvent<HTMLInputElement>) {
    setInputValues({ ...inputValues, casesExceed: event.currentTarget.value });
  }

  function handleSelectedLocationChange(locations: string[]) {
    setInputValues({ ...inputValues, selectedLocations: locations });
  }

  function handleDownloadClick() {
    const node = document.getElementById('single-location-progression-chart') as Node;

    domtoimage
      .toBlob(node)
      .then(blob => FileSaver.saveAs(blob, 'my-node.png'));
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
        <Col xs={12} lg={4} className='d-flex flex-column px-4 py-3'>
          <Form.Group>
            <Form.Label>Location</Form.Label>
            <Typeahead
              id='location-selection'
              options={locations}
              placeholder="Select location..."
              highlightOnlyResult
              selectHintOnEnter
              clearButton
              onChange={handleSelectedLocationChange}
              onBlur={handleLocationMenuBlur}
              selected={inputValues.selectedLocations}
              paginationText='Show more countries'
            />
          </Form.Group>
          <Accordion>
            <Accordion.Toggle as={Button} variant="link" eventKey="0" className='w-100'>
              More Options
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0" className='py-2'>
              <Card className='bg-transparent border-white'>
                <Card.Body>
                  <Row>
                    <Col xs={12} sm={6} lg={12}>
                      <Form.Group>
                        <Form.Label>Start from the day</Form.Label>
                        <Form.Control as="select">
                          <option>confirmed cases</option>
                          <option>deaths</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={6} lg={12}>
                      <Form.Group>
                        <Form.Label>exceeded</Form.Label>
                        <Form.Control
                          value={inputValues.casesExceed}
                          onChange={handleCasesExceedChange}
                          isInvalid={inputErrors.casesExceed.length > 0}
                        />
                        <Form.Control.Feedback type="invalid">
                          {inputErrors.casesExceed?.[0]}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Accordion.Collapse>
          </Accordion>
          <div className='mt-auto'>
            <Button onClick={handleDownloadClick}>
              Download as PNG
            </Button>
          </div>
        </Col>
        <Col>
          <div id='single-location-progression-chart'>
            <SingleLocationProgressionChart
              data={data.values}
              location={location}
              casesExceed={parseInt(inputValues.casesExceed)}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SingleLocationProgression;
