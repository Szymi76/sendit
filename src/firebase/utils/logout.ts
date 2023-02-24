import { signOut } from "firebase/auth";

import sb from "../../sendbird";
import { auth } from "..";

const logout = async () => {
  try {
    await signOut(auth);
    await sb.disconnect();
  } catch (err) {
    console.warn(err);
  }
};

export default logout;
