import React, { FunctionComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import { ROUTE_PATHS } from '../constants';
import CasesInLocation from './CasesInLocation/CasesInLocation';
import About from './About';
import ChartsIndex from './ChartsIndex';
import CovidDataStore from '../store/CovidDataStore';

interface RouterProps {
  dataStore: CovidDataStore;
}

const Router: FunctionComponent<RouterProps> = ({ dataStore }) => {
  return (
    <div className='py-4 flex-grow-1 d-block-when-width-sufficient'>
      <Switch>
        <Route path={ROUTE_PATHS.casesInLocation}>
          <CasesInLocation store={dataStore} />
        </Route>
        <Route path={ROUTE_PATHS.about}>
          <About />
        </Route>
        <Route path={ROUTE_PATHS.home}>
          <ChartsIndex />
        </Route>
      </Switch>
    </div>
  );
};

export default Router;
