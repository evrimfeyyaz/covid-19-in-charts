import React, { FormEvent, FunctionComponent, useEffect, useState } from 'react';
import CovidDataStore, { DateValues, LocationData } from '../store/CovidDataStore';
import SingleLocationProgressionChart from './SingleLocationProgressionChart';
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
import ShareButtons from './ShareButtons';
import { COLORS } from '../constants';
import { uuidv4 } from '../utilities/uuidv4';
import Loading from './Loading';
import Helmet from 'react-helmet';
import { createPageTitle } from '../utilities/metaUtilities';

interface SingleLocationProgressionProps {
  store: CovidDataStore,
}

interface InputValues {
  selectedLocations: string[],
  exceedingProperty: string,
  exceedingValue: string
}

interface InputErrors {
  selectedLocations: string[],
  exceedingValue: string[]
}

function validateInputs(selectedLocations: string[], exceedingValue: string): InputErrors {
  let errors: InputErrors = {
    exceedingValue: [],
    selectedLocations: [],
  };

  if (exceedingValue.match(/^\d+$/)) {
    errors.exceedingValue = [];
  } else {
    errors.exceedingValue = ['Please enter a number.'];
  }

  if (selectedLocations.length === 0) {
    errors.selectedLocations = ['No location selected.'];
  } else {
    errors.selectedLocations = [];
  }

  return errors;
}

const SingleLocationProgression: FunctionComponent<SingleLocationProgressionProps> = ({ store }) => {
  const defaultLocation = 'US';

  const [locations] = useState(store.locations);
  const [data, setData] = useState<LocationData>();
  const [lastUpdated, setLastUpdated] = useState<Date>();
  const [areChartAnimationsActive, setAreChartAnimationsActive] = useState(true);

  const [location = defaultLocation, setLocation] = useQueryParam('location', StringParam);
  const [exceedingProperty = 'confirmed', setExceedingProperty] = useQueryParam('exceedingProperty', StringParam);
  const [exceedingValue = 10, setExceedingValue] = useQueryParam('exceedingValue', NumberParam);

  const firstDate = data?.values?.[0]?.date;
  const lastDate = data?.values?.[data?.values?.length - 1]?.date;
  const chartId = 'single-location-progression-chart';
  const title = `COVID-19 Progression: ${location}`;

  const [inputValues, setInputValues] = useState<InputValues>({
    selectedLocations: [location],
    exceedingProperty: exceedingProperty,
    exceedingValue: exceedingValue.toString(),
  });
  const [inputErrors, setInputErrors] = useState<InputErrors>({
    selectedLocations: [],
    exceedingValue: [],
  });

  useEffect(() => {
    const { selectedLocations, exceedingValue, exceedingProperty } = inputValues;
    const errors = validateInputs(selectedLocations, exceedingValue);
    setInputErrors(errors);

    if (errors.exceedingValue.length === 0 && errors.selectedLocations.length === 0) {
      const exceedingNum = parseInt(exceedingValue);
      let selectedLocation = inputValues.selectedLocations[0];
      let selectedExceedingProperty = inputValues.exceedingProperty;

      if (store.locations.indexOf(selectedLocation) === -1) {
        selectedLocation = defaultLocation;

        setInputValues({
          ...inputValues,
          selectedLocations: [selectedLocation],
        });
      }

      const exceedingPropertyValues = ['confirmed', 'deaths'];
      if (exceedingPropertyValues.indexOf(exceedingProperty) === -1) {
        selectedExceedingProperty = exceedingPropertyValues[0];

        setInputValues({
          ...inputValues,
          exceedingProperty: selectedExceedingProperty,
        });
      }

      const data = store.getDataByLocation(selectedLocation);
      const lastUpdated = store.lastUpdated;
      const strippedData = CovidDataStore.stripDataBeforePropertyExceedsN(data, selectedExceedingProperty, exceedingNum);

      setData(strippedData);
      setLastUpdated(lastUpdated);
      setLocation(selectedLocation);
      setExceedingValue(exceedingNum);
      setExceedingProperty(selectedExceedingProperty);
    }
  }, [store, inputValues, setLocation, setExceedingValue, setExceedingProperty, location]);

  function handleLocationMenuBlur() {
    if (inputValues.selectedLocations.length === 0) {
      setInputValues({ ...inputValues, selectedLocations: [location] });
    }
  }

  function handleExceedingPropertyChange(event: FormEvent<HTMLInputElement>) {
    setInputValues({ ...inputValues, exceedingProperty: event.currentTarget.value });
  }

  function handleExceedingValueChange(event: FormEvent<HTMLInputElement>) {
    setInputValues({ ...inputValues, exceedingValue: event.currentTarget.value });
  }

  function handleSelectedLocationChange(locations: string[]) {
    setInputValues({ ...inputValues, selectedLocations: locations });
  }

  function handleDownloadClick() {
    setAreChartAnimationsActive(false);
    const node = document.getElementById(chartId) as HTMLElement;
    const horizontalPadding = 20;
    const verticalPadding = 20;
    const fileName = `${uuidv4()}.png`;

    // Some of the code below is from
    // https://github.com/tsayen/dom-to-image/issues/69#issuecomment-486146688
    domtoimage
      .toBlob(node, {
        width: node.offsetWidth * 2 + horizontalPadding * 2 * 2,
        height: node.offsetHeight * 2 + verticalPadding * 2 * 2,
        bgcolor: COLORS.bgColor,
        style: {
          padding: `${verticalPadding}px ${horizontalPadding}px`,
          transform: 'scale(2)',
          transformOrigin: 'top left',
          width: node.offsetWidth + horizontalPadding * 2 + 'px',
          height: node.offsetHeight + verticalPadding * 2 + 'px',
        },
      })
      .then(blob => FileSaver.saveAs(blob, fileName))
      .finally(() => setAreChartAnimationsActive(true));
  }

  let body = <Loading />;

  if (data != null && lastUpdated != null) {
    body = (
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
              paginationText='Show more locations'
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
                        <Form.Control
                          as="select"
                          onChange={handleExceedingPropertyChange}
                          value={exceedingProperty}
                        >
                          <option value='confirmed'>confirmed cases</option>
                          <option value='deaths'>deaths</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={6} lg={12}>
                      <Form.Group>
                        <Form.Label>exceeded</Form.Label>
                        <Form.Control
                          value={inputValues.exceedingValue}
                          onChange={handleExceedingValueChange}
                          isInvalid={inputErrors.exceedingValue.length > 0}
                        />
                        <Form.Control.Feedback type="invalid">
                          {inputErrors.exceedingValue?.[0]}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Accordion.Collapse>
          </Accordion>
          <div className='mt-auto'>
            <h2 className='h5 mt-3'>Share</h2>
            <ShareButtons title={title} url={window.location.href} />

            <h2 className='h5 mt-3'>Download</h2>
            <Button onClick={handleDownloadClick} className='ml-2'>
              Download as PNG
            </Button>
          </div>
        </Col>
        <Col>
          <div id={chartId}>
            <SingleLocationProgressionChart
              title={title}
              data={data?.values as DateValues}
              lastUpdated={lastUpdated as Date}
              firstDate={firstDate}
              lastDate={lastDate}
              exceedingProperty={exceedingProperty}
              exceedingValue={exceedingValue}
              isAnimationActive={areChartAnimationsActive}
            />
          </div>
        </Col>
      </Row>
    );
  }

  return (
    <Container>
      <Helmet>
        <title>{createPageTitle(title)}</title>
      </Helmet>
      {body}
    </Container>
  );
};

export default SingleLocationProgression;
