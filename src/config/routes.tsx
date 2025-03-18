import { BrowserRouter, Routes, Route} from "react-router";
import LoginPage from "../pages/LoginPage"


function AppRouter() {
    return (
 <BrowserRouter>
<Routes>
<Route path="/" element={<LoginPage />} />
</Routes>
</BrowserRouter>
    ) 
}

export default AppRouter;