import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import PlanTrip from "./pages/PlanTrip";
import Planner from "./pages/planner/PlannerPage";
import Explore from "./pages/Explore";
import ErrorPage from "./pages/ErrorPage";

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/plan">
        <PlanTrip />
      </Route>
      <Route path="/explore">
        <Explore />
      </Route>
      <Route path="/trip/:name">
        <Planner />
      </Route>
      <Route>
        <ErrorPage />
      </Route>
    </Switch>
  );
};

export default Routes;
