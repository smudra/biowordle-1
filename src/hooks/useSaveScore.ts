import { setDoc, doc, addDoc, collection } from "firebase/firestore";
import { useBoolean } from "@chakra-ui/react";
import { format } from "date-fns";

import { useAuthUser } from "./useAuthUser";
import { useGetUserScores } from "./useGetUserScores";
import { db } from "../../config/firebase";

const getMonthKey = () => format(new Date(), "MMMyy");

export const useSaveScore = () => {
  const [isSaving, setSaving] = useBoolean();

  const { user } = useAuthUser();
  const { scores } = useGetUserScores();

  const saveResult = async (score: number, word: string) => {
    if (!user) return;

    await addDoc(collection(db, "results"), {
      userId: user.uid,
      score,
      word,
    });
  };

  const saveScore = async (score: number, word: string) => {
    if (!user) return;

    try {
      setSaving.on();
      saveResult(score, word);
      const monthKey = getMonthKey();
      const { totalScore = 0 } = scores || {};
      const monthlyScore = scores?.[monthKey] || 0;

      const newTotal = totalScore + score;
      const newMonthtly = monthlyScore + score;

      await setDoc(doc(db, "scores", user.uid), {
        [monthKey]: newMonthtly,
        totalScore: newTotal,
      });
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      }
    } finally {
      setSaving.off();
    }
  };

  return { saveScore, isSaving };
};
