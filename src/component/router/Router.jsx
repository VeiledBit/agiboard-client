/* eslint-disable react/jsx-wrap-multilines */
import React from "react";
// eslint-disable-next-line object-curly-newline
import { BrowserRouter as Router, Navigate, Route, Routes, useParams } from "react-router-dom";
import Login from "../auth/Login";
import AuthService from "../../service/AuthService";
import Boards from "../boards/Boards";
import Register from "../auth/Register";
import Board from "../board/Board";

function BoardWrapper() {
    const { id } = useParams();
    return (
        <PrivateRoute>
            <Board boardId={id} />
        </PrivateRoute>
    );
}

export default function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    exact
                    element={
                        <PrivateRouteLoggedIn>
                            <Login />
                        </PrivateRouteLoggedIn>
                    }
                />
                <Route
                    path="/boards"
                    exact
                    element={
                        <PrivateRoute>
                            <Boards />
                        </PrivateRoute>
                    }
                />
                <Route path="/board/:id" exact element={<BoardWrapper />} />
                <Route path="/register" exact element={<Register />} />
            </Routes>
        </Router>
    );
}

function PrivateRoute({ children }) {
    const userInfo = AuthService.getUserInfo();

    if (userInfo === null) {
        return <Navigate to="/" replace />;
    }

    return children;
}

function PrivateRouteLoggedIn({ children }) {
    const userInfo = AuthService.getUserInfo();

    if (userInfo !== null) {
        return <Navigate to="/boards" replace />;
    }

    return children;
}
