import React, { FunctionComponent } from 'react';
import Card from 'react-bootstrap/Card';
import { DateValue } from '../store/CovidDataStore';
import { prettifyMDYDate } from '../utilities/dateUtilities';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

interface SingleLocationProgressionTooltipProps {
  payload: { payload: DateValue }[],
  label: string,
  active: boolean
}

const SingleLocationProgressionTooltip: FunctionComponent<SingleLocationProgressionTooltipProps> = ({ payload, label, active }) => {
  if (!active) {
    return null;
  }

  const { confirmed, newConfirmed, deaths, date } = payload[0].payload;

  return (
    <Card className='shadow-sm'>
      <Card.Body>
        <Card.Title>
          {prettifyMDYDate(date)}
        </Card.Title>
        <Card.Text>
          <Row as='dl' className='w-50'>
            <Col as='dt' xs={9}>
              Confirmed cases
            </Col>
            <Col as='dd' xs={3}>
              {confirmed}
            </Col>

            <Col as='dt' xs={9}>
              New cases
            </Col>
            <Col as='dd' xs={3}>
              {newConfirmed}
            </Col>

            <Col as='dt' xs={9}>
              Deaths
            </Col>
            <Col as='dd' xs={3}>
              {deaths}
            </Col>
          </Row>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default SingleLocationProgressionTooltip;
