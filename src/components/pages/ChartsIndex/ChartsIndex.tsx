import React, { FunctionComponent } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { IMAGES, ROUTE_PATHS } from '../../../constants';
import ChartsIndexCard from './ChartsIndexCard';

const ChartsIndex: FunctionComponent = () => {
  return (
    <Container>
      <Row>
        <ChartsIndexCard
          title='Cases, Recoveries and Deaths'
          description='See the number of confirmed cases, new cases, recoveries and deaths over time.'
          image={IMAGES.casesInLocationCard}
          link={ROUTE_PATHS.casesInLocation}
        />

        <ChartsIndexCard
          title='Daily Numbers'
          description='See the daily number of confirmed cases, recoveries, deaths and other data points.'
          image={IMAGES.dailyNumbersCard}
          link={ROUTE_PATHS.dailyNumbers}
        />

        <ChartsIndexCard
          title='More Visualizations to Come'
          image={IMAGES.moreVisualizationsCard}
        />
      </Row>
    </Container>
  );
};

export default ChartsIndex;