import { query, collection, getDocs } from "firebase/firestore";

import type { LoaderFunction } from "react-router-dom";

import { db } from "../../config/firebase.js";

type Word = { value: string; date: string };

type GetWords = () => Promise<Word[]>;

export const loader: LoaderFunction = async () => {
  const getWords: GetWords = async () => {
    const q = query(collection(db, "words"));
    const snapshot = await getDocs(q);
    return snapshot?.docs?.map((doc) => doc.data()) as Word[];
  };

  const words = await getWords();

  return { words };
};
