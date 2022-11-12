import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  Input,
  Stack,
  Link,
  useBoolean,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { sendSignInLinkToEmail, signOut } from "firebase/auth";
import { MdKeyboardBackspace } from "react-icons/md";

import { useAuthUser } from "../hooks/useAuthUser";
import { auth } from "../../config/firebase";

const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: "https://localhost:5173",
  // This must be true.
  handleCodeInApp: true,
};

export const Profile = () => {
  const [email, setEmail] = useState("");
  const [isEmailSent, setEmailSent] = useState(false);

  const [processing, setProcessing] = useBoolean();

  const { loading, user } = useAuthUser();

  const navigate = useNavigate();

  const handleSignIn = async () => {
    if (!email) {
      return;
    }

    try {
      setProcessing.on();
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      setEmailSent(true);
    } catch (error) {
      console.error(error);
    } finally {
      setProcessing.off();
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  if (loading) {
    return null;
  }

  return (
    <Flex
      justifyContent="center"
      bgColor="gray.700"
      height="100%"
      padding="24px"
    >
      <Flex flexDirection="column" width="80%" maxWidth="600px">
        <Text color="white" fontWeight="bold" fontSize="4xl" textAlign="center">
          Bio-Wordle Profile Page
        </Text>
        <Box
          alignItems="center"
          display="flex"
          justifyContent="center"
          w="100%"
          marginBottom="88px"
        >
          <Icon as={MdKeyboardBackspace} boxSize="18px" color="white" />
          <Link as={RouterLink} color="white" fontWeight="bold" to="/">
            Game
          </Link>
        </Box>

        {user && (
          <Stack alignItems="center">
            <Text color="gray.100" textAlign="center">
              You are signed in as {user.email}
            </Text>
            <Button colorScheme="red" onClick={handleSignOut} width="200px">
              Sign out
            </Button>
          </Stack>
        )}

        {!user && !isEmailSent && (
          <Stack direction="row" alignItems="flex-end">
            <Stack spacing="24px" width="100%">
              <Text color="gray.300" fontSize="18px">
                Sign in or create a new account by entering your email address
                below. A {`"magic link"`} will be sent to your email address
                (please check your spam folder just in case). Click on this
                email and you will be automatically logged in. No password
                required!
              </Text>

              <Stack direction="row" alignItems="flex-end">
                <Box flex={1}>
                  <Text color="gray.300">Email address</Text>
                  <Input
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                  />
                </Box>
                <Button
                  isLoading={processing}
                  onClick={handleSignIn}
                  width="150px"
                >
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </Stack>
        )}

        {!user && isEmailSent && (
          <Text color="gray.300" fontSize="18px" textAlign="center">
            Please check your email for instructions on how to sign in!
          </Text>
        )}
      </Flex>
    </Flex>
  );
};
