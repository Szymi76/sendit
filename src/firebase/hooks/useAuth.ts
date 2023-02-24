import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

import { auth as firebaseAuth } from "..";

type Auth = { user: typeof firebaseAuth.currentUser | null; isLoading: boolean };

const useAuth = () => {
  const [auth, setAuth] = useState<Auth>({ user: null, isLoading: true });

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (currentUser) => {
      setAuth({ user: currentUser, isLoading: false });
    });
  }, []);

  const test = auth;

  return auth;
};

export default useAuth;
