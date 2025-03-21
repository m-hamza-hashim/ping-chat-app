import { BrowserRouter, Routes, Route, Navigate} from "react-router";
import ChatPage from "../pages/chat/ChatPage"
import LoginPage from "../pages/login/LoginPage"
import RegPage from "../pages/register/RegPage"
import {useContext} from "react";
import User from "./context/UserContext";
import NotFound from "../pages/not-found/NotFound";





function AppRouter() {
    const { userID } = useContext(User);
  
    return (
        <BrowserRouter>
        <Routes>
        <Route path="/chat" element={userID? <ChatPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!userID ? <LoginPage /> : <Navigate to="/chat" />} />
        <Route path="/" element={!userID ? <LoginPage /> : <Navigate to="/chat" />} />
        <Route path="/register" element={!userID ? <RegPage /> : <Navigate to="/chat" />} />
        <Route path="*" element={!userID ? <NotFound /> : <Navigate to="/chat" />} />
        </Routes>
        </BrowserRouter>
    );
  }

export default AppRouter;
