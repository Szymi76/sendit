import { doc, updateDoc } from "firebase/firestore";

import { firestore } from "..";

const updateDocument = async <T>(path: string, documentId: string, valuesToUpdate: Partial<T>) => {
  const ref = doc(firestore, path, documentId);
  // @ts-ignore
  await updateDoc(ref, valuesToUpdate);
};

export default updateDocument;
