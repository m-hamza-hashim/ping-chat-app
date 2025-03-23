import AppRouter from "./config/routes";
import User from "./config/context/UserContext";
import { useState, useEffect } from "react";
import { onAuthStateChanged, auth } from "./config/firebase";


function App() {
  const [userID, setUser] = useState<any>(null);


  useEffect(() => {
    
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        setUser(user);
        // ...
      } else {
        // User is signed out
        // ...

      }
    });
  })


  return (
    <User.Provider value={{ userID, setUser }}>
      <AppRouter />
    </User.Provider>
  );
}

export default App;

