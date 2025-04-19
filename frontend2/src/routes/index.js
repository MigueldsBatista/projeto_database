import React from "react";
import { Switch } from "react-router-dom";

import MyRoute from "./myRoutes";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Page404 from "../pages/Page404";
import Postagens from "../pages/Postagens";
import Profile from "../pages/Profile"
import Postar from "../pages/Postar"
import Comentar from "../pages/Comentar"

export default function Rotas() {
    return (
        <Switch>
            <MyRoute exact path="/Comentar" component={Comentar} isClosed/>
            <MyRoute exact path="/postar/" component={Postar} isClosed/>
            <MyRoute exact path="/profile/" component={Profile} isClosed/>
            <MyRoute exact path="/postagem/" component={Postagens} isClosed/>
            <MyRoute exact path="/" component={Login} isClosed={false}/>
            <MyRoute exact path="/register/" component={Register} isClosed={false}/>
            <MyRoute  path="*" component={Page404}/>
        </Switch>
    );
}
