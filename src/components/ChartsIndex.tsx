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
                Test
              </Card.Title>
              <Card.Text>
                Hello
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ChartsIndex;
