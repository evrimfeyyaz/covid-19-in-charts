import React, { ChangeEvent, FunctionComponent } from 'react';
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

interface CountryStateComparisonOptionsProps {
  locationInputComponent: JSX.Element,
  propertyInputComponent: JSX.Element,
  exceedingPropertyInputComponent: JSX.Element,
  exceedingValueInputComponent: JSX.Element,
}

const CountryStateComparisonOptions:
  FunctionComponent<CountryStateComparisonOptionsProps> = ({
                                                             locationInputComponent,
                                                             propertyInputComponent,
                                                             exceedingPropertyInputComponent,
                                                             exceedingValueInputComponent,
                                                           }) => {
  return (
    <>
      {locationInputComponent}
      {propertyInputComponent}
      <Accordion>
        <Accordion.Toggle as={Button} variant="link" eventKey="0" className='w-100'>
          More Options
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0" className='py-2'>
          <Card className='bg-transparent border-white'>
            <Card.Body>
              <Row>
                <Col xs={12}>
                  {exceedingPropertyInputComponent}
                </Col>
                <Col xs={12}>
                  {exceedingValueInputComponent}
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
