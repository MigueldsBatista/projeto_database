import React from "react";
import { Switch } from "react-router-dom";

import MyRoute from "./myRoutes";
import Register from "../pages/Register";
import Page404 from "../pages/Page404";

export default function Rotas() {
    return (
        <Switch>
            <MyRoute exact path="/register/" component={Register} isClosed={false}/>
            <MyRoute  path="*" component={Page404}/>
        </Switch>
    );
}
