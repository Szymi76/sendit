import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  QueryFieldFilterConstraint,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

import { firestore } from "..";

type Status = { isLoading: boolean; isSuccess: boolean };

const initialStatus: Status = { isLoading: false, isSuccess: false };

const useGetDocumentsWithQuery = <T>(path: string, whereFilter: QueryFieldFilterConstraint) => {
  const [status, setStatus] = useState<Status>(initialStatus);
  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const ref = collection(firestore, path) as CollectionReference<T>;
        const q = query(ref, whereFilter);
        const docs = await getDocs(q);
        const fetchedItemsArr: T[] = [];
        docs.forEach((doc) => {
          const document = doc.data();
          if (document) fetchedItemsArr.push(document);
        });
        setData(fetchedItemsArr);
        setStatus({ isLoading: false, isSuccess: true });
      } catch (err) {
        setStatus({ isLoading: false, isSuccess: true });
      }
    };

    fetchDocument();
  }, []);

  const { isLoading, isSuccess } = status;
  return { data, isLoading, isSuccess } as const;
};

export default useGetDocumentsWithQuery;
