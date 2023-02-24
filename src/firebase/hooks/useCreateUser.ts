import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";

import sb from "../../sendbird";
import { auth } from "../index";

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

const useCreateUser = () => {
  const [status, setStatus] = useState<Status>({ isLoading: false, error: null });

  const createUser = async ({ email, password, displayName }: CreateUserTypes) => {
    try {
      // status podczas rozpoczęcia
      setStatus({ isLoading: true, error: null });

      // tworzernie użytkownika w firebase i aktualizacja danych
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName, photoURL: DEFAULT_PHOTO_URL });

      // łączenie się z sendbird-em, tworzenie użytkownika i aktualizacja danych
      await sb.connect(user.uid, import.meta.env.VITE_APP_TOKEN);
      await sb.updateCurrentUserInfo({ nickname: displayName, profileUrl: DEFAULT_PHOTO_URL });

      // status w przypadku sukcesu
      setStatus({ isLoading: false, error: null });
    } catch (err) {
      // status w przypadku błędu
      setStatus({ isLoading: false, error: new Error("Coś poszło nie tak") });
      console.warn(err);
    }
  };

  const { isLoading, error } = status;
  return [createUser, { isLoading, error }] as const;
};

export default useCreateUser;
