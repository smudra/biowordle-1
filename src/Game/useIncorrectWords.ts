import { useCallback } from "react";

import { addDoc, collection, Timestamp } from "firebase/firestore";

import { db } from "../../config/firebase";

type UseIncorrectWords = () => {
  logIncorrectWord(guessedWord: string, currentWord: string): Promise<void>;
};

export const useIncorrectWords: UseIncorrectWords = () => {
  const logIncorrectWord = useCallback(
    async (guessedWord: string, currentWord: string) => {
      await addDoc(collection(db, "guessedWords"), {
        currentWord,
        guessedWord,
        createdAt: Timestamp.now(),
      });
    },
    []
  );

  return { logIncorrectWord };
};
