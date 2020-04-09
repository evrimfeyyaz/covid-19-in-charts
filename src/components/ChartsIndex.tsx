import React, { FunctionComponent } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

const ChartsIndex: FunctionComponent = () => {
  return (
    <Container>
      <Row>
        <Col lg={4}>
          <Card>
            <Card.Body>
              <Card.Title>
                Cases, Recoveries and Deaths
              </Card.Title>
              <Card.Text>
                See the number of confirmed cases, new cases, recoveries and deaths.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Img variant="top" src={require('../images/more-charts-to-come.png')} />
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
