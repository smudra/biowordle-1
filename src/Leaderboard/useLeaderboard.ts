import { useEffect, useCallback, useState } from "react";
import { format } from "date-fns";

import { getDocs, query, collection, orderBy, limit } from "firebase/firestore";

import { db } from "../../config/firebase";

type Score = {
  userId: string;
  email: string;
  name?: string;
  value: number;
};

type UseLeaderboard = () => {
  allTime: Score[];
  monthly: Score[];
  monthKey: string;
  monthName: string;
  setNextMonth(): void;
  setPreviousMonth(): void;
};

const getMonthKey = (date = new Date()) => format(date, "MMMyy");
const getMonth = (date = new Date()) => format(date, "MMMM");

export const useLeaderboard: UseLeaderboard = () => {
  const [allTime, setAllTime] = useState<Score[]>([]);
  const [monthly, setMonthly] = useState<Score[]>([]);

  const [monthKey, setMonthKey] = useState(getMonthKey());
  const [monthName, setMonthName] = useState(getMonth());
  const [month, setMonth] = useState(new Date());

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
        const { totalScore, ...rest } = data;
        return { userId: doc.id, value: totalScore, ...rest };
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
        const { email, name } = data;
        return { userId: doc.id, value, email, name };
      }) as Score[]
    );
  }, [monthKey]);

  const setPreviousMonth = () => {
    const previousMonth = month;
    previousMonth.setDate(0);
    setMonth(previousMonth);
    setMonthKey(getMonthKey(previousMonth));
    setMonthName(getMonth(previousMonth));
  };

  const setNextMonth = () => {
    const nextMonth = month;
    nextMonth.setDate(32);
    setMonth(nextMonth);
    setMonthKey(getMonthKey(nextMonth));
    setMonthName(getMonth(nextMonth));
  };

  useEffect(() => {
    getAllTime();
    getThisMonth();
  }, [getAllTime, getThisMonth]);

  return {
    allTime,
    monthly,
    monthKey,
    monthName,
    setPreviousMonth,
    setNextMonth,
  };
};
