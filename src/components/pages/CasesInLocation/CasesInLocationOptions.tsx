import React, { FormEvent, FunctionComponent } from 'react';
import Form from 'react-bootstrap/Form';
import { Typeahead } from 'react-bootstrap-typeahead';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { getAliasesForLocation } from '../../../utilities/countryUtilities';

export type ExceedingProperty = 'confirmed' | 'deaths';

interface CasesInLocationOptionsProps {
  locations: string[],
  location: string,
  exceedingProperty: ExceedingProperty,
  exceedingValue: number,
  onLocationChange: (location: string) => void,
  onExceedingPropertyChange: (exceedingProperty: ExceedingProperty) => void,
  onExceedingValueChange: (exceedingValue: number) => void
}

const CasesInLocationOptions: FunctionComponent<CasesInLocationOptionsProps> = ({
                                                                                  locations, location,
                                                                                  exceedingProperty, exceedingValue,
                                                                                  onLocationChange, onExceedingPropertyChange,
                                                                                  onExceedingValueChange,
                                                                                }) => {
  function handleExceedingPropertyChange(event: FormEvent<HTMLInputElement>) {
    const newExceedingProperty = event.currentTarget.value as ExceedingProperty;

    if (newExceedingProperty !== exceedingProperty) {
      onExceedingPropertyChange(newExceedingProperty);
    }
  }

  function handleExceedingValueChange(event: FormEvent<HTMLInputElement>) {
    const { value } = event.currentTarget;
    let newExceedingValue = parseInt(value);

    if (newExceedingValue !== exceedingValue) {
      onExceedingValueChange(newExceedingValue);
    }
  }

  function handleLocationChange(locations: string[]) {
    if (locations != null && locations.length > 0 && locations[0] !== location) {
      onLocationChange(locations[0]);
    }
  }

  function filterLocationsBy(option: string, props: { text: string }) {
    const location = option.toLowerCase().trim();
    const text = props.text.toLowerCase().trim();
    const aliases = getAliasesForLocation(option).map(alias => alias.toLowerCase().trim());

    const allNames = [location, ...aliases];

    return allNames.some(name => name.includes(text));
  }

  return (
    <>
      <Form.Group>
        <Form.Label>Location</Form.Label>
        <Typeahead
          id='location-selection'
          options={locations}
          filterBy={filterLocationsBy}
          placeholder="Select location..."
          highlightOnlyResult
          selectHintOnEnter
          clearButton
          onChange={handleLocationChange}
          defaultInputValue={location}
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
                      defaultValue={exceedingValue}
                      onChange={handleExceedingValueChange}
                    />
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

export default CasesInLocationOptions;
