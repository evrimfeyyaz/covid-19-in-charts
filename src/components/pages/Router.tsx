import { COVID19API } from "@evrimfeyyaz/covid-19-api";
import React, { FunctionComponent } from "react";
import { Route, Switch } from "react-router-dom";
import { ROUTE_PATHS } from "../../constants";
import { About } from "./About";
import { SingleLocation } from "./SingleLocation/SingleLocation";

interface RouterProps {
  /**
   * A `COVID19API` instance to pass on to the page components.
   */
  dataStore: COVID19API;
}

/**
 * The component that uses React Router to resolve and render the current page.
 */
export const Router: FunctionComponent<RouterProps> = ({ dataStore }) => {
  return (
    <div className="py-4 flex-grow-1 d-block-when-width-sufficient">
      <Switch>
        <Route path={ROUTE_PATHS.singleLocation}>
          <SingleLocation store={dataStore} />
        </Route>
        <Route path={ROUTE_PATHS.about}>
          <About />
        </Route>
        <Route path={ROUTE_PATHS.home}>
          <SingleLocation store={dataStore} />
        </Route>
      </Switch>
    </div>
  );
};
