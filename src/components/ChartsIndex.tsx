import React, { FunctionComponent } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '../constants';

const ChartsIndex: FunctionComponent = () => {
  return (
    <Container>
      <Row>
        <Col sm={6} lg={4}>
          <Card className='my-3 m-sm-2'>
            <Card.Img variant="top" src={require('../images/cases-recoveries-and-deaths.jpg')} />
            <Card.Body>
              <Card.Title>
                Cases, Recoveries and Deaths
              </Card.Title>
              <Card.Text>
                See the number of confirmed cases, new cases, recoveries and deaths.
                <Link to={ROUTE_PATHS.casesInLocation} className='stretched-link' />
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={6} lg={4}>
          <Card className='my-3 m-sm-2'>
            <Card.Img variant="top" src={require('../images/more-charts-to-come.jpg')} />
            <Card.Body>
              <Card.Title>
                More Visualizations to Come
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ChartsIndex;
