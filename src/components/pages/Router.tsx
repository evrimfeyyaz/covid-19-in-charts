import React, { FunctionComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import { ROUTE_PATHS } from '../../constants';
import CasesRecoveriesDeaths from './CasesRecoveriesDeaths/CasesRecoveriesDeaths';
import About from './About';
import ChartsIndex from './ChartsIndex/ChartsIndex';
import Covid19DataStore from '../../store/Covid19DataStore';
import DailyNumbers from './DailyNumbers/DailyNumbers';
import CountryStateComparison from './CountryStateComparison/CountryStateComparison';

interface RouterProps {
  dataStore: Covid19DataStore;
}

const Router: FunctionComponent<RouterProps> = ({ dataStore }) => {
  return (
    <div className='py-4 flex-grow-1 d-block-when-width-sufficient'>
      <Switch>
        <Route path={ROUTE_PATHS.casesRecoveriesDeaths}>
          <CasesRecoveriesDeaths store={dataStore} />
        </Route>
        <Route path={ROUTE_PATHS.countryStateComparison}>
          <CountryStateComparison store={dataStore} />
        </Route>
        <Route path={ROUTE_PATHS.dailyNumbers}>
          <DailyNumbers store={dataStore} />
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
