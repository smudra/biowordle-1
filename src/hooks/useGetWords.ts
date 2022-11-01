import { useEffect, useCallback, useState } from "react";

import { getDocs, query, collection } from "firebase/firestore";

import { db } from "../../config/firebase.js";

type Word = { value: string; date: string };

type UseGetWords = () => {
  words: Word[];
  refetch(): Promise<void>;
};

export const useGetWords: UseGetWords = () => {
  const [words, setWords] = useState<Word[]>([]);

  const getWords = useCallback(async () => {
    const q = query(collection(db, "words"));
    const snapshot = await getDocs(q);
    setWords(snapshot?.docs?.map((doc) => doc.data()) as Word[]);
  }, []);

  useEffect(() => {
    getWords();
  }, [getWords]);

  return { words, refetch: getWords };
};
