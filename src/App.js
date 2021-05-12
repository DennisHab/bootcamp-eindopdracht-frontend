
import './App.css';
import React, {useState} from 'react';
import {BrowserRouter as Router, Switch, Route, BrowserRouter} from "react-router-dom";
import TopMenu from "./components/TopMenu";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Events from "./pages/Events";
import Venues from "./pages/Venues";
import Reviews from "./pages/Reviews";

function App() {
  return (
      <BrowserRouter>
        <Router>
          <TopMenu/>
          <Switch>
            <Route exact path="/">
              <Home/>
            </Route>
            <Route exact path="/login">
              <Login/>
            </Route>
            <Route exact path="/register">
              <Register/>
            </Route>
            <Route exact path="/profile">
              <Profile/>
            </Route>
            <Route exact path="/events">
              <Events/>
            </Route>
            <Route exact path="/venues">
              <Venues/>
            </Route>
            <Route exact path="/reviews">
              <Reviews/>
            </Route>
          </Switch>
        </Router>
      </BrowserRouter>
  )
}
export default App;
