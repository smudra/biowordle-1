import { useEffect, useCallback, useState } from "react";

import { doc, getDoc } from "firebase/firestore";

import { useAuthUser } from "./useAuthUser";
import { db } from "../../config/firebase";

type Scores = {
  totalScore: number;
  email: string;
  name?: string;
  // [key: string]: number; // this breaks the above. See https://stackoverflow.com/questions/49969390/how-do-i-type-an-object-with-known-and-unknown-keys-in-typescript to implement a proper fix.
};

type UseGetUserScores = () => {
  scores?: Scores;
};

export const useGetUserScores: UseGetUserScores = () => {
  const [scores, setScores] = useState<Scores>();
  const { user } = useAuthUser();

  const getScores = useCallback(async () => {
    if (!user) {
      return;
    }

    const docRef = doc(db, "scores", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setScores(docSnap.data() as Scores);
    }
  }, [user]);

  useEffect(() => {
    getScores();
  }, [getScores]);

  return { scores };
};
