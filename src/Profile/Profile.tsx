import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Text,
  Input,
  Stack,
  useBoolean,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useNavigate, useNavigation, Form } from "react-router-dom";
import type { ActionFunctionArgs } from "react-router-dom";
import { sendSignInLinkToEmail, signOut, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

import { useAuthUser } from "../hooks/useAuthUser";
import { useGetUserScores } from "../hooks/useGetUserScores";
import { BackButton } from "../BackButton";
import { StatBox } from "./StatBox";
import { auth, db } from "../../config/firebase";

const isProd = import.meta.env.PROD;

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const name = formData.get("name") as string;

  if (!auth.currentUser || !name) {
    return;
  }

  await updateProfile(auth.currentUser, { displayName: name });
  try {
    await updateDoc(doc(db, "scores", auth.currentUser.uid), { name });
  } catch (error) {
    // don't throw
  }
};

const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: isProd
    ? "https://biowordle.puresoluble.com/profile"
    : "http://localhost:5173/profile",
  // This must be true.
  handleCodeInApp: true,
};

const getMonthFrom = (key: string) => {
  return `${key.slice(0, 3)} '${key.slice(3, 5)}`;
};

export const Profile = () => {
  const [email, setEmail] = useState("");
  const [isEmailSent, setEmailSent] = useState(false);

  const [processing, setProcessing] = useBoolean();

  const { loading, user } = useAuthUser();
  const name = user?.displayName || undefined;

  const { scores } = useGetUserScores();

  const {
    totalScore = 0,
    name: _name,
    email: _email,
    ...restScores
  } = scores || {};
  const navigate = useNavigate();
  const navigation = useNavigation();

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
      minHeight="100%"
      padding="24px"
    >
      <Flex flexDirection="column" width="80%" maxWidth="600px">
        <Text color="white" fontWeight="bold" fontSize="4xl" textAlign="center">
          BioWordle Profile Page
        </Text>
        <BackButton />

        {user && (
          <Stack spacing="36px">
            <div>
              {name ? (
                <Text color="gray.100" fontSize="36px" fontWeight={500}>
                  Hello, {name}
                </Text>
              ) : (
                <Alert status="warning" marginBottom="12px">
                  <AlertIcon />
                  Please add a username to continue
                </Alert>
              )}
              <Text color="gray.300">You are signed in with {user.email}</Text>
            </div>

            <Form method="post">
              <FormControl maxWidth="300px">
                <FormLabel color="gray.300">Username</FormLabel>
                <HStack>
                  <Input
                    defaultValue={user.displayName || undefined}
                    color="gray.100"
                    name="name"
                  ></Input>
                  <Button
                    isLoading={navigation.state === "submitting"}
                    type="submit"
                  >
                    Save
                  </Button>
                </HStack>
              </FormControl>
            </Form>

            <Divider />

            <Stack spacing="24px">
              <StatBox label="Total score" stat={totalScore} />
              {Object.keys(restScores || {}).map((key) => (
                <StatBox
                  key={key}
                  label={getMonthFrom(key)}
                  // @ts-ignore
                  stat={restScores[key]}
                />
              ))}
            </Stack>

            <Divider />

            <Flex justifyContent="center">
              <Button colorScheme="red" onClick={handleSignOut} width="200px">
                Sign out
              </Button>
            </Flex>
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
                    color="gray.300"
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
            Please check your email for instructions on how to sign in! Check
            your spam folder just in case.
          </Text>
        )}
      </Flex>
    </Flex>
  );
};
