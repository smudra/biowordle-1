import { useEffect, useState, useCallback } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";

import { useAuthUser } from "../hooks/useAuthUser";
import { db } from "../../config/firebase";

type UseUserPlayed = (word: string) => boolean;

export const useUserPlayed: UseUserPlayed = (word) => {
  const { user } = useAuthUser();

  const [hasUserPlayedToday, setHasUserPlayedToday] = useState(false);

  const checkHasUserPlayedToday = useCallback(async () => {
    if (!user) {
      return false;
    }

    const q = query(
      collection(db, "results"),
      where("word", "==", word),
      where("userId", "==", user.uid)
    );
    const snapshot = await getDocs(q);
    setHasUserPlayedToday(!snapshot.empty);
  }, [user, word]);

  useEffect(() => {
    checkHasUserPlayedToday();
  }, [checkHasUserPlayedToday]);

  return hasUserPlayedToday;
};
