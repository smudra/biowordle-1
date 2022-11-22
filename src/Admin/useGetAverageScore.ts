import { useCallback } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";

import { db } from "../../config/firebase";

export const useGetAverageScore = () => {
  const getAverageOfWord = useCallback(async (word: string) => {
    const q = query(collection(db, "results"), where("word", "==", word));
    const snapshot = await getDocs(q);
    const scores = snapshot?.docs?.map((doc) => {
      const data = doc.data();
      return data.score;
    });

    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }, []);

  return { getAverageOfWord };
};
