import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom"
import React from "react";
import Login from "../auth/Login";
import AuthService from "../../service/AuthService";
import Boards from "../boards/Boards";
import Register from "../auth/Register";
import Board from "../board/Board";

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" exact element={<PrivateRouteLoggedIn>
                    <Login />
                </PrivateRouteLoggedIn>} />
                <Route path="/boards" exact element={<PrivateRoute>
                    <Boards />
                </PrivateRoute>} />
                <Route path="/board/:id" exact element={<PrivateRoute>
                    <Board />
                </PrivateRoute>} />
                <Route path="/register" exact element={<Register />} />
            </Routes>
        </Router>
    )
};

// const PrivateRoute = ({component: Component, ...rest}) => (
//     <Route {...rest} render={
//         props => AuthService.getUserInfo() ?
//             (<Component {...props}/>) :
//             (<Navigate to={{pathname: "/"}}/>)
//     }
//     />
// );

const PrivateRoute = ({ children }) => {
    const userInfo = AuthService.getUserInfo();

    if (userInfo === null) {
        return <Navigate to="/" replace />
    }

    return children;
}

const PrivateRouteLoggedIn = ({ children }) => {
    const userInfo = AuthService.getUserInfo();

    if (userInfo !== null) {
        return <Navigate to="/boards" replace />
    }

    return children;
}


// const PrivateRouteLoggedIn = ({element: Element, ...rest}) => (
//     <Route 
//         {...rest} 
//         element={
//             !AuthService.getUserInfo('roomCode') ? (
//             <Navigate to="/room" replace />
//             ) : (
//             <Element />
//             )
//         }
//     />
// );

export default AppRouter;