import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";

import { auth } from "../index";
import createDocument from "../utils/createDocument";

const DEFAULT_PHOTO_URL = "https://sendbird.com/main/img/profiles/profile_05_512px.png";

interface CreateUserTypes {
  displayName: string;
  email: string;
  password: string;
}

interface Status {
  isLoading: boolean;
  error: null | Error;
}

const useRegisterUser = () => {
  const [status, setStatus] = useState<Status>({ isLoading: false, error: null });

  const createUser = async ({ email, password, displayName }: CreateUserTypes) => {
    try {
      // status podczas rozpoczęcia
      setStatus({ isLoading: true, error: null });

      // tworzernie użytkownika w firebase i aktualizacja danych
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName, photoURL: DEFAULT_PHOTO_URL });

      const userObject = {
        uid: user.uid,
        displayName,
        email,
        photoURL: DEFAULT_PHOTO_URL,
        friends: [],
      };

      // dodawanie użytkownika do bazy danych
      await createDocument("users", user.uid, userObject);

      // status w przypadku sukcesu
      setStatus({ isLoading: false, error: null });
    } catch (err) {
      if (String(err).includes("(auth/email-already-in-use)")) {
        setStatus({ isLoading: false, error: new Error("Konto z takim adresem email już istnieje") });
      } else {
        setStatus({ isLoading: false, error: new Error("Coś poszło nie tak") });
      }
      console.warn(err);
    }
  };

  const { isLoading, error } = status;
  return [createUser, { isLoading, error }] as const;
};

export default useRegisterUser;
