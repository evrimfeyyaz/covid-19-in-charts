import React, { ChangeEvent, FunctionComponent } from 'react';
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export type ExceedingProperty = 'confirmed' | 'deaths';

interface CountryStateComparisonOptionsProps {
  locationInputComponent: JSX.Element,
  property: string,
  exceedingProperty: ExceedingProperty,
  exceedingValue: number,
  onPropertyChange: (property: string) => void,
  onExceedingPropertyChange: (exceedingProperty: ExceedingProperty) => void,
  onExceedingValueChange: (exceedingValue: number) => void
}

const CountryStateComparisonOptions: FunctionComponent<CountryStateComparisonOptionsProps> = ({
                                                                                                locationInputComponent,
                                                                                                property,
                                                                                                exceedingProperty,
                                                                                                exceedingValue,
                                                                                                onPropertyChange,
                                                                                                onExceedingPropertyChange,
                                                                                                onExceedingValueChange,
                                                                                              }) => {
  function handlePropertyChange(event: ChangeEvent<HTMLInputElement>) {
    const newProperty = event.currentTarget.value;

    if (newProperty !== property) {
      onPropertyChange(newProperty);
    }
  }

  function handleExceedingPropertyChange(event: ChangeEvent<HTMLInputElement>) {
    const newExceedingProperty = event.currentTarget.value as ExceedingProperty;

    if (newExceedingProperty !== exceedingProperty) {
      onExceedingPropertyChange(newExceedingProperty);
    }
  }

  function handleExceedingValueChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.currentTarget;
    let newExceedingValue = parseInt(value);

    if (newExceedingValue !== exceedingValue) {
      onExceedingValueChange(newExceedingValue);
    }
  }

  return (
    <>
      {locationInputComponent}
      <Form.Group>
        <Form.Label>Compare</Form.Label>
        <Form.Control
          as="select"
          className='custom-select'
          onChange={handlePropertyChange}
          value={property}
        >
          <option value='confirmed'>confirmed cases</option>
          <option value='deaths'>deaths</option>
          <option value='recovered'>recoveries</option>
          <option value='mortalityRate'>mortality rate</option>
          <option value='recoveryRate'>recovery rate</option>
          <option value='newConfirmed'>new cases</option>
          <option value='newDeaths'>new deaths</option>
          <option value='newRecovered'>new recoveries</option>
        </Form.Control>
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

export default CountryStateComparisonOptions;
