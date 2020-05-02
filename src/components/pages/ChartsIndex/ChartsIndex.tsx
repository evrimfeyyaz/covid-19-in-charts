import React, { FunctionComponent } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { IMAGES, ROUTE_PATHS, ROUTE_TITLES } from '../../../constants';
import ChartsIndexCard from './ChartsIndexCard';

const ChartsIndex: FunctionComponent = () => {
  return (
    <Container>
      <Row>
        <ChartsIndexCard
          title={ROUTE_TITLES.casesRecoveriesDeaths}
          description='See the number of confirmed cases, new cases, recoveries and deaths over time.'
          image={IMAGES.casesRecoveriesDeathsCard}
          link={ROUTE_PATHS.casesRecoveriesDeaths}
        />

        <ChartsIndexCard
          title={ROUTE_TITLES.dailyNumbers}
          description='See the daily number of confirmed cases, recoveries, deaths and other data points.'
          image={IMAGES.dailyNumbersCard}
          link={ROUTE_PATHS.dailyNumbers}
        />

        <ChartsIndexCard
          title={ROUTE_TITLES.locationComparison}
          description='Compare various data points between multiple locations.'
          image={IMAGES.locationComparisonCard}
          link={ROUTE_PATHS.locationComparison}
        />
      </Row>
    </Container>
  );
};

export default ChartsIndex;
