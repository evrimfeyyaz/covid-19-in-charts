import { COVID19API } from "@evrimfeyyaz/covid-19-api";
import React, { FunctionComponent } from "react";
import { Route, Switch } from "react-router-dom";
import { ROUTE_PATHS } from "../../constants";
import About from "./About";
import CasesRecoveriesDeaths from "./CasesRecoveriesDeaths/CasesRecoveriesDeaths";
import ChartsIndex from "./ChartsIndex/ChartsIndex";
import DailyNumbers from "./DailyNumbers/DailyNumbers";
import LocationComparison from "./LocationComparison/LocationComparison";

interface RouterProps {
  dataStore: COVID19API;
}

const Router: FunctionComponent<RouterProps> = ({ dataStore }) => {
  return (
    <div className="py-4 flex-grow-1 d-block-when-width-sufficient">
      <Switch>
        <Route path={ROUTE_PATHS.casesRecoveriesDeaths}>
          <CasesRecoveriesDeaths store={dataStore} />
        </Route>
        <Route path={ROUTE_PATHS.locationComparison}>
          <LocationComparison store={dataStore} />
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
