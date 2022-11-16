import { useEffect, useCallback, useState } from "react";
import { format } from "date-fns";

import { getDocs, query, collection, orderBy, limit } from "firebase/firestore";

import { db } from "../../config/firebase";

type Score = {
  userId: string;
  username?: string; // TODO
  value: number;
};

type UseLeaderboard = () => {
  allTime: Score[];
  monthly: Score[];
  monthKey: string;
  month: string;
};

const getMonthKey = () => format(new Date(), "MMMyy");
const getMonth = () => format(new Date(), "MMMM");

export const useLeaderboard: UseLeaderboard = () => {
  const [allTime, setAllTime] = useState<Score[]>([]);
  const [monthly, setMonthly] = useState<Score[]>([]);

  const monthKey = getMonthKey();
  const month = getMonth();

  const getAllTime = useCallback(async () => {
    const q = query(
      collection(db, "scores"),
      orderBy("totalScore", "desc"),
      limit(10)
    );
    const snapshot = await getDocs(q);
    setAllTime(
      snapshot?.docs?.map((doc) => {
        const data = doc.data();
        const value = data.totalScore;
        return { userId: doc.id, value };
      }) as Score[]
    );
  }, []);

  const getThisMonth = useCallback(async () => {
    const q = query(
      collection(db, "scores"),
      orderBy(monthKey, "desc"),
      limit(10)
    );
    const snapshot = await getDocs(q);
    setMonthly(
      snapshot?.docs?.map((doc) => {
        const data = doc.data();
        const value = data[monthKey];
        return { userId: doc.id, value };
      }) as Score[]
    );
  }, [monthKey]);

  useEffect(() => {
    getAllTime();
    getThisMonth();
  }, [getAllTime, getThisMonth]);

  return { allTime, monthly, monthKey, month };
};
