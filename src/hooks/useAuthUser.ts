import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { useBoolean } from "@chakra-ui/react";

import { auth } from "../../config/firebase";

type UseAuthUser = () => {
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

  return { loading, user };
};
