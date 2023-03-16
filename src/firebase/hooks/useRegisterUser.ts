import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc } from "firebase/firestore";
import { useState } from "react";

import { db_User } from "../../types/database";
import { auth } from "../index";
import refs from "../utils/refs";

interface CreateUserTypes {
  displayName: string;
  email: string;
  password: string;
}

interface Status {
  isLoading: boolean;
  error: null | Error;
}

// HOOK DO TWORZENIA UŻYTKOWNIKA
const useRegisterUser = () => {
  const [status, setStatus] = useState<Status>({ isLoading: false, error: null });

  const createUser = async ({ email, password, displayName }: CreateUserTypes) => {
    try {
      // status podczas rozpoczęcia
      setStatus({ isLoading: true, error: null });

      // tworzernie użytkownika w firebase i aktualizacja danych
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName });

      const userObject: db_User = {
        uid: user.uid,
        displayName,
        email,
        photoURL: null,
        friendsUids: [],
        chatsIds: [],
      };

      // dodawanie użytkownika do bazy danych
      const newUserRef = refs.users.doc(user.uid);
      await setDoc(newUserRef, userObject);

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
