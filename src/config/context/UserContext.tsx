
import { Dispatch, SetStateAction } from "react";
import { createContext } from "react";

interface IUserContext {
  userID: any;
  setUser: Dispatch<SetStateAction<any>>;
}



const User = createContext<IUserContext>({
  userID: null,
  setUser: () => {},
});

export default User;

