import AppRouter from "./config/routes";
import User from "./config/context/UserContext";
import { useState, useEffect } from "react";
import { onAuthStateChanged, auth, doc, db, getDoc } from "./config/firebase";


function App() {
  const [userID, setUser] = useState<any>(null);


  useEffect(() => {
    
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);


        setUser(docSnap.data());

        // ...
      } else {
        // User is signed out
        // ...
        setUser(null);
      }
    });
  }, [])


  return (
    <User.Provider value={{ userID, setUser }}>
      <AppRouter />
    </User.Provider>
  );
}

export default App;

