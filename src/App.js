
import './App.css';
import React, {useContext} from 'react';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import TopMenu from "./components/TopMenu";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Events from "./pages/Events";
import Venues from "./pages/Venues";
import Reviews from "./pages/Reviews";
import SingleVenue from "./pages/SingleVenue";
import SingleEvent from "./pages/SingleEvent";
import PrivateRoute from "./components/PrivateRoute";
import LoadingAnimation from "./components/LoadingAnimation";

function App() {
  return (
        <>
          <TopMenu/>
          <Switch>
            <Route exact path="/">
              <Home/>
            </Route>
            <Route exact path="/venues/:id">
              <SingleVenue/>
            </Route>
            <Route exact path="/events/:id">
              <SingleEvent/>
            </Route>
            <Route exact path="/login">
              <Login/>
            </Route>
            <Route exact path="/register">
              <Register/>
            </Route>
            <PrivateRoute
                path="/profile"
                component={<Profile />}
            />
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
        </>

  )
}
export default App;
