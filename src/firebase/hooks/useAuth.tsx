import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

import { auth as firebaseAuth } from "..";

type Auth = { user: typeof firebaseAuth.currentUser | null; isLoading: boolean };

export const AuthContext = createContext<Auth | null>(null);

export type AuthProviderProps = { children: React.ReactNode };

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<Auth>({ user: null, isLoading: true });

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (currentUser) => {
      setAuth({ user: currentUser, isLoading: false });
    });
  }, []);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// HOOK Z AKTUALNIE ZALOGOWANYM UŻYTKOWNIKIEM ORAZ STATUSEM 'isLoading', KTÓRY MÓWI O TYM CZY UŻYTKOWNIK JEST/LUB ZOSTAŁ SPRAWDZONY
// I MOŻNA DOKONAĆ ROUTÓW NA PODSTAWIE TEGO CZY UŻYTKOWNIK JEST LUB NIE JEST ZALOGOWANY
const useAuth = () => {
  const context = useContext(AuthContext)!;
  return context;
};

export default useAuth;
