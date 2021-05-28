import  React, {useContext}from  "react";
import { Route, Redirect } from  "react-router-dom";
import {AuthContext} from "../context/AuthContext";

function  PrivateRoute( {path, component}) {
    const {user} = useContext(AuthContext)

    return  user ? <Route  exact path= {path}> {component} </Route> :
        <Redirect  to="/"/>
}
export  default  PrivateRoute;