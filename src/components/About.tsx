import React, { FunctionComponent } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { EXTERNAL_LINKS } from '../constants';
import Card from 'react-bootstrap/Card';

const About: FunctionComponent = () => {
  return (
    <Container>
      <Row>
        <Col lg={{ span: 10, offset: 1 }}>
          <h1 className='h3'>About COVID-19 in Charts</h1>
          <p>
            I created this website to help people see the COVID-19 data in a visual way, and give everyone a way
            to easily create shareable images of these visualizations.
          </p>

          <p>
            This website uses the <a href='https://github.com/CSSEGISandData/COVID-19'>data provided by the Johns
            Hopkins University Center for Systems Science and Engineering (JHU CSSE)</a>. This data isn't perfect,
            so, I wouldn't recommend using this website in any official manner.
          </p>

          <p>
            The source code of this website is open-source. You can <a href={EXTERNAL_LINKS.gitHubRepo}>view the
            repository on GitHub</a>.
          </p>

          <p>
            If you have any suggestions or comments, feel free to send them to <a
            href={`mailto:${EXTERNAL_LINKS.feedbackEmail}`}>{EXTERNAL_LINKS.feedbackEmail}</a>.
          </p>
        </Col>
      </Row>
      <Row>
        <Col lg={{ span: 8, offset: 2 }} className='mt-3'>
          <Card>
            <Card.Body>
              <Card.Title>
                Looking for a web or mobile app developer?
              </Card.Title>
              <Card.Text>
                If you are looking for a web or mobile app developer, I might be available for freelance work. You
                can <a href={EXTERNAL_LINKS.authorWebsite}>find out more about me on my website</a>.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
