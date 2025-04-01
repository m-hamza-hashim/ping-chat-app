import { createContext } from "react";
const User = createContext({
    userID: null,
    setUser: () => { },
});
export default User;
