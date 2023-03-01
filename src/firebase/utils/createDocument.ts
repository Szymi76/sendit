import { doc, setDoc } from "firebase/firestore";

import { firestore } from "../";

const createDocument = async (path: string, documentName: string, data: any, merge = false) => {
  const ref = doc(firestore, path, documentName);
  await setDoc(ref, data, { merge });
};

export default createDocument;
