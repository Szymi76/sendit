import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { storage } from "..";

const uploadFile = async (data: Blob, name: string) => {
  const storageRef = ref(storage, `profiles/${name}.jpg`);
  const file = await uploadBytes(storageRef, data);
  const url = await getDownloadURL(file.ref);
  return url;
};

export default uploadFile;
