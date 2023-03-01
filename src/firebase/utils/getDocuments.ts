import { collection, DocumentReference, FieldPath, getDocs, query, where, WhereFilterOp } from "firebase/firestore";

import { firestore } from "../";

type Criteria = { field: string | FieldPath; operator: WhereFilterOp; value: unknown };

type Document<T> = { id: string; ref: DocumentReference<T>; data: T };

const getDocuments = async <T>(path: string, criteria: Criteria) => {
  const ref = collection(firestore, path);
  const q = query(ref, where(criteria.field, criteria.operator, criteria.value));

  const snapshot = await getDocs(q);
  const array: Document<T>[] = [];
  snapshot.forEach((doc) => {
    array.push({
      id: doc.id,
      // @ts-ignore
      ref: doc.ref,
      // @ts-ignore
      data: doc.data(),
    });
  });

  return array;
};

export default getDocuments;
