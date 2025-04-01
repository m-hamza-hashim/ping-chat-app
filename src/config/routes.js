import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import ChatPage from "../pages/chat/ChatPage";
import LoginPage from "../pages/login/LoginPage";
import RegPage from "../pages/register/RegPage";
import { useContext } from "react";
import User from "./context/UserContext";
import NotFound from "../pages/not-found/NotFound";
function AppRouter() {
    const { userID } = useContext(User);
    return (_jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/chat", element: userID ? _jsx(ChatPage, {}) : _jsx(Navigate, { to: "/" }) }), _jsx(Route, { path: "/login", element: !userID ? _jsx(LoginPage, {}) : _jsx(Navigate, { to: "/chat" }) }), _jsx(Route, { path: "/", element: !userID ? _jsx(LoginPage, {}) : _jsx(Navigate, { to: "/chat" }) }), _jsx(Route, { path: "/register", element: !userID ? _jsx(RegPage, {}) : _jsx(Navigate, { to: "/chat" }) }), _jsx(Route, { path: "*", element: !userID ? _jsx(NotFound, {}) : _jsx(Navigate, { to: "/chat" }) })] }) }));
}
export default AppRouter;
