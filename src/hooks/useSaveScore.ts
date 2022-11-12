import { setDoc, doc } from "firebase/firestore";
import { useBoolean } from "@chakra-ui/react";
import { format } from "date-fns";

import { useAuthUser } from "./useAuthUser";
import { useGetUserScores } from "./useGetUserScores";
import { db } from "../../config/firebase";

export const useSaveScore = () => {
  const [isSaving, setSaving] = useBoolean();

  const { user } = useAuthUser();
  const { scores } = useGetUserScores();

  const getMonthKey = () => format(new Date(), "MMMyy");

  const saveScore = async (score: number) => {
    if (!user) {
      return;
    }

    try {
      setSaving.on();
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
