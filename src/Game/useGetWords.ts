import { useEffect, useCallback, useState } from "react";

import { doc, getDoc } from "firebase/firestore";

import { db } from "../../config/firebase.js";

type UseGetWords = () => {
  currentWord: string;
  newWords?: string[];
  usedWords?: string[];
};

export const useGetWords: UseGetWords = () => {
  const [newWords, setNewWords] = useState<string[] | undefined>();
  const [usedWords, setUsedWords] = useState<string[] | undefined>();

  const getNewWords = useCallback(async () => {
    const ref = doc(db, "words", "new");
    const snap = await getDoc(ref);
    const data = snap.data();
    setNewWords(data?.list);
  }, []);

  const getUsedWords = useCallback(async () => {
    const ref = doc(db, "words", "used");
    const snap = await getDoc(ref);
    const data = snap.data();
    setUsedWords(data?.list);
  }, []);

  useEffect(() => {
    getNewWords();
    getUsedWords();
  }, [getNewWords, getUsedWords]);

  return { currentWord: newWords?.[0] || "", newWords, usedWords };
};
