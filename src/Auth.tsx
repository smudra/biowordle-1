import { useEffect } from "react";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { Outlet, useNavigate } from "react-router-dom";

import { auth } from "../config/firebase";

export const Auth = () => {
  const navigate = useNavigate();

  const handleSignIn = (email: string) => {
    signInWithEmailLink(auth, email, window.location.href)
      .then(() => {
        console.log("signed in?");
        window.localStorage.removeItem("emailForSignIn");
        return navigate("/profile");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const providedEmail = window.localStorage.getItem("emailForSignIn");
      if (!providedEmail) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        const promptedEmail = window.prompt(
          "Please provide your email for confirmation"
        );

        if (!promptedEmail) {
          return;
        }

        handleSignIn(promptedEmail);
      } else {
        handleSignIn(providedEmail);
      }
    }
  }, []);

  return <Outlet />;
};
