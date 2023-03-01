import { doc, DocumentReference, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import { firestore } from "..";

type Status = { isLoading: boolean; isSuccess: boolean };

const initialStatus: Status = { isLoading: false, isSuccess: false };

const useGetDocument = <T>(path: string, id: string) => {
  const [status, setStatus] = useState<Status>(initialStatus);
  const [data, setData] = useState<null | T>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setStatus({ isLoading: true, isSuccess: false });
        const ref = doc(firestore, path, id) as DocumentReference<T>;
        const document = await (await getDoc(ref)).data();
        if (!document) return setStatus({ isLoading: false, isSuccess: true });
        setData(document);
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

export default useGetDocument;
