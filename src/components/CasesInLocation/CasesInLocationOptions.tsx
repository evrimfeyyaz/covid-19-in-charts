import React, { FormEvent, FunctionComponent, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Typeahead } from 'react-bootstrap-typeahead';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { getAliasesForLocation } from '../../utilities/countryUtilities';

export type ExceedingProperty = 'confirmed' | 'deaths';

interface InputValues {
  locations: string[],
  exceedingProperty: ExceedingProperty,
  exceedingValue: string
}

interface InputErrors {
  locations: string[],
  exceedingValue: string[]
}

interface CasesInLocationOptionsProps {
  defaultLocation: string,
  locations: string[],
  location: string,
  exceedingProperty: ExceedingProperty,
  exceedingValue: number,
  onValuesChange: (location: string, exceedingProperty: ExceedingProperty, exceedingValue: number) => void;
}

const CasesInLocationOptions: FunctionComponent<CasesInLocationOptionsProps> = ({
                                                                                  defaultLocation,
                                                                                  locations, location,
                                                                                  exceedingProperty, exceedingValue,
                                                                                  onValuesChange,
                                                                                }) => {
  const [inputValues, setInputValues] = useState<InputValues>({
    locations: [location],
    exceedingProperty: exceedingProperty,
    exceedingValue: exceedingValue.toString(),
  });

  const [inputErrors, setInputErrors] = useState<InputErrors>({
    locations: [],
    exceedingValue: [],
  });

  const [locationsWithAliases, setLocationsWithAliases] = useState<{ location: string, aliases: string[] }[]>();

  useEffect(() => {
    const { locations, exceedingValue, exceedingProperty } = inputValues;
    const errors = validateInputs(locations, exceedingValue);
    setInputErrors(errors);

    if (errors.exceedingValue.length === 0 && errors.locations.length === 0) {
      const exceedingNum = parseInt(exceedingValue);
      let selectedLocation = inputValues.locations[0];
      let selectedExceedingProperty = inputValues.exceedingProperty;

      if (locations.indexOf(selectedLocation) === -1) {
        selectedLocation = defaultLocation;

        setInputValues({
          ...inputValues,
          locations: [selectedLocation],
        });
      }

      const exceedingPropertyValues = ['confirmed', 'deaths'];
      if (exceedingPropertyValues.indexOf(exceedingProperty) === -1) {
        selectedExceedingProperty = exceedingPropertyValues[0] as ExceedingProperty;

        setInputValues({
          ...inputValues,
          exceedingProperty: selectedExceedingProperty,
        });
      }

      onValuesChange(selectedLocation, exceedingProperty, exceedingNum);
    }
  }, [inputValues, locations, onValuesChange, defaultLocation]);

  useEffect(() => {
    setLocationsWithAliases(locations.map(location => ({
      location,
      aliases: getAliasesForLocation(location),
    })));
  }, [locations]);

  function handleLocationMenuBlur() {
    if (inputValues.locations.length === 0) {
      setInputValues({ ...inputValues, locations: [location] });
    }
  }

  function handleExceedingPropertyChange(event: FormEvent<HTMLInputElement>) {
    setInputValues({ ...inputValues, exceedingProperty: event.currentTarget.value as ExceedingProperty });
  }

  function handleExceedingValueChange(event: FormEvent<HTMLInputElement>) {
    setInputValues({ ...inputValues, exceedingValue: event.currentTarget.value });
  }

  function handleSelectedLocationChange(locations: string[]) {
    setInputValues({ ...inputValues, locations: locations });
  }

  return (
    <>
      <Form.Group>
        <Form.Label>Location</Form.Label>

        <Typeahead
          id='location-selection'
          labelKey={'location' as any}
          options={locationsWithAliases as any}
          filterBy={['aliases']}
          placeholder="Select location..."
          highlightOnlyResult
          selectHintOnEnter
          clearButton
          onChange={handleSelectedLocationChange}
          onBlur={handleLocationMenuBlur}
          selected={inputValues.locations}
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
                      className='custom-select'
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
    </>
  );
};

function validateInputs(selectedLocations: string[], exceedingValue: string): InputErrors {
  let errors: InputErrors = {
    exceedingValue: [],
    locations: [],
  };

  if (exceedingValue.match(/^\d+$/)) {
    errors.exceedingValue = [];
  } else {
    errors.exceedingValue = ['Please enter a number.'];
  }

  if (selectedLocations.length === 0) {
    errors.locations = ['No location selected.'];
  } else {
    errors.locations = [];
  }

  return errors;
}

export default CasesInLocationOptions;
