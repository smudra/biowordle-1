import { useCallback, useEffect, useState } from "react";
import { collection, query, getDocs, orderBy } from "firebase/firestore";

import { db } from "../../config/firebase";

type GuessedWord = {
  id: string;
  guessedWord: string;
  currentWord: string;
};

export const useIncorrectlyGuessedWords = () => {
  const [incorrectlyGuessedWords, setWords] = useState<GuessedWord[]>([]);
  console.log(
    "🚀 ~ file: useIncorrectlyGuessedWords.ts ~ line 8 ~ useIncorrectlyGuessedWords ~ incorrectlyGuessedWords",
    incorrectlyGuessedWords
  );

  const getWords = useCallback(async () => {
    const q = query(collection(db, "guessedWords"), orderBy("guessedWord"));
    const snapshot = await getDocs(q);
    const words = snapshot?.docs?.map((doc) => {
      const data = doc.data();
      return { ...data, id: doc.id };
    }) as GuessedWord[];

    setWords(words);
  }, []);

  useEffect(() => {
    getWords();
  }, [getWords]);

  return { incorrectlyGuessedWords };
};
