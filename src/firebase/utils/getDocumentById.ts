import { doc, DocumentReference, getDoc } from "firebase/firestore";

import { firestore } from "..";

type Document<T> = { id: string; ref: DocumentReference<T>; data: T };

const getDocumentById = async <T>(path: string, documentId: string) => {
  const ref = doc(firestore, path, documentId) as DocumentReference<T>;
  const snapshot = await getDoc(ref);
  const document: Document<T> = {
    id: snapshot.id,
    ref: snapshot.ref,
    data: snapshot.data()!,
  };

  return document;
};

export default getDocumentById;
