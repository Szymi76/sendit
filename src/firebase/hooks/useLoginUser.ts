import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

import { auth } from "../index";

interface LoginUserTypes {
  email: string;
  password: string;
}

interface Status {
  isLoading: boolean;
  error: null | Error;
}

const useLoginUser = () => {
  const [status, setStatus] = useState<Status>({ isLoading: false, error: null });

  const loginUser = async ({ email, password }: LoginUserTypes) => {
    try {
      // status podczas rozpoczęcia
      setStatus({ isLoading: true, error: null });

      // logowanie użytkownika i łączenie się z sendbird-em
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      // status w przypadku sukcesu
      setStatus({ isLoading: false, error: null });
    } catch (err) {
      if (String(err).includes("(auth/user-not-found)")) {
        setStatus({ isLoading: false, error: new Error("Użytkownik nie istnieje") });
      } else if (String(err).includes("(auth/wrong-password)")) {
        setStatus({ isLoading: false, error: new Error("Niepoprawne hasło lub adres email") });
      } else {
        setStatus({ isLoading: false, error: new Error("Coś poszło nie tak") });
      }
    }
  };

  const { isLoading, error } = status;
  return [loginUser, { isLoading, error }] as const;
};

export default useLoginUser;
