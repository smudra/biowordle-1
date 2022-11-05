import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useBoolean } from "@chakra-ui/react";

import { db } from "../../config/firebase";

export const useSaveWord = () => {
  const [isSaving, setSaving] = useBoolean();

  const checkIsExistingWord = async (value: string) => {
    const q = query(collection(db, "words"), where("value", "==", value));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  };

  const deleteWordForDate = async (date: string) => {
    const q = query(collection(db, "words"), where("date", "==", date));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return;
    }

    const matchedDoc = snapshot.docs[0];
    await deleteDoc(doc(db, "words", matchedDoc.id));
  };

  const saveWord = async (value: string, date: string) => {
    try {
      setSaving.on();
      const isExisting = await checkIsExistingWord(value);
      if (isExisting) {
        throw new Error("This word has already been used");
      }

      await deleteWordForDate(date);
      await addDoc(collection(db, "words"), {
        value,
        date,
      });
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      }
    } finally {
      setSaving.off();
    }
  };

  return { saveWord, isSaving };
};
