import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom"
import React from "react";
import Login from "../auth/Login";
import AuthService from "../../service/AuthService";
import Boards from "../boards/Boards";
import Register from "../auth/Register";
import Board from "../board/Board";

const AppRouter = () => {
    return (
        <Router>
            <Switch>
                <PrivateRouteLoggedIn path="/" exact component={Login}/>
                <PrivateRoute path="/boards" exact component={Boards}/>
                <PrivateRoute path="/board/:id" exact component={Board}/>
                <Route path="/register" exact component={Register}/>
            </Switch>
        </Router>
    )
};

const PrivateRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={
        props => AuthService.getUserInfo() ?
            (<Component {...props}/>) :
            (<Redirect to={{pathname: "/"}}/>)
    }
    />
);

const PrivateRouteLoggedIn = ({component: Component, ...rest}) => (
    <Route {...rest} render={
        props => !AuthService.getUserInfo() ?
            (<Component {...props}/>) :
            (<Redirect to={{pathname: "/boards"}}/>)
    }
    />
);

export default AppRouter;