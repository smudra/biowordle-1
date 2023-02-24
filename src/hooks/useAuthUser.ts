import { useEffect, useState, useMemo } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { useBoolean } from "@chakra-ui/react";

import { adminIds } from "../vars";
import { auth } from "../../config/firebase";

type UseAuthUser = () => {
  isAdmin: boolean;
  loading: boolean;
  user?: User;
};

export const useAuthUser: UseAuthUser = () => {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useBoolean(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setLoading.off();
      } else {
        setLoading.off();
      }
    });
  }, [setLoading]);

  const isAdmin = useMemo(() => {
    if (!user) return false;

    return adminIds.includes(user.uid);
  }, [user]);

  return { loading, user, isAdmin };
};
