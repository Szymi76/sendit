import { updateProfile } from "firebase/auth";
import { updateDoc } from "firebase/firestore";

import refs from "../../hooks/useChat/utils/refs";
import { auth } from "..";
import uploadFile from "./uploadFile";

export type UpdateUserArgs = { displayName?: string; photoURL?: string | File | null };

const updateUser = async ({ displayName, photoURL }: UpdateUserArgs) => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    if (photoURL && typeof photoURL != "string") {
      const url = await uploadFile(photoURL, "profiles", user?.uid);
      photoURL = url;
    }

    if (displayName && (displayName.length < 4 || displayName.length > 15))
      return console.warn("New display name is out of chars range");

    const updateObject: { displayName?: string; photoURL?: string } = {};
    if (displayName) updateObject.displayName = displayName;
    if (photoURL) updateObject.photoURL = photoURL;

    await updateProfile(user, { displayName, photoURL: photoURL });
    const userRef = refs.users.doc(user.uid);

    await updateDoc(userRef, updateObject);
  } catch (err) {
    console.warn(err);
  }
};

export default updateUser;
