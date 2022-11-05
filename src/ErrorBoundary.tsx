import { useRouteError } from "react-router-dom";
import {
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

export const ErrorBoundary = () => {
  const error = useRouteError() as { error: unknown };

  let errorMessage = "Something went wrong.";
  if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <Center>
      <Alert
        status="error"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Oops!
        </AlertTitle>
        <AlertDescription maxWidth="sm">{errorMessage}</AlertDescription>
      </Alert>
    </Center>
  );
};
