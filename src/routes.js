import React from "react";
import { Route, HashRouter, Switch } from "react-router-dom";
import Cards from "./components/Cards";
// import Main from "./components/Main";
import SignUpPage from "./pages/SignUpPage";
import ScrollToTop from "./components/ScrollToTop";
import Walkthrough from "./components/Walkthrough";
import { GamePlayerPage, WelcomePage } from "./pages";

const Routes = () => (
  <HashRouter>
    <ScrollToTop>
      <Switch>
        <Route exact path="/" component={WelcomePage} />
        <Route exact path="/signup" component={SignUpPage} />
        <Route exact path="/walkthrough" component={Walkthrough} />
        <Route exact path="/gameplayer" component={GamePlayerPage} />
        <Route exact path="/cards" component={Cards} />
      </Switch>
    </ScrollToTop>
  </HashRouter>
);

export default Routes;
