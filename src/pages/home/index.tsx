import { Button } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { auth } from "../../firebase";
import logout from "../../firebase/utils/logout";

const Home = () => {
  const [user, setUser] = useState<null | typeof auth.currentUser>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);

  return (
    <div style={{ height: "200vh", display: "flex", flexDirection: "column", gap: 24, maxWidth: 400 }}>
      <p>Home</p>
      <button onClick={logout}>Log out</button>
      {user ? user.displayName : "Nie zalogowano"}
      <Link to="/zaloguj-sie">Zaloguj sie</Link>
      <Link to="/private">Tylko dla zalogowanych</Link>
      <Button variant="contained">123</Button>
    </div>
  );
};

export default Home;
