import React from "react";
import { Switch } from "react-router-dom";

import MyRoute from "./myRoutes";
import Register from "../pages/Register";
import Login from "../pages/Login"; 
import Profile from "../pages/Profile";
import Page404 from "../pages/Page404";
import Dashboard from "../pages/Dashboad";

export default function Rotas() {
    return (
        <Switch>
            <MyRoute exact path="/register/" component={Register} isClosed={false}/>
            <MyRoute exact path="/dashboard/" component={Dashboard} isClosed={false}/>
            <MyRoute exact path="/" component={Login} isClosed={false}/>
            <MyRoute exact path="/profile/" component={Profile} isClosed={false}/>
            <MyRoute  path="*" component={Page404}/>
        </Switch>
    );
}
