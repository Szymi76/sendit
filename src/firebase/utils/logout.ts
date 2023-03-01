import { signOut } from "firebase/auth";

import { auth } from "..";

const logout = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn(err);
  }
};

export default logout;
