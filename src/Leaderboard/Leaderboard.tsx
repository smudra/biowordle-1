import { Text, Flex, Stack } from "@chakra-ui/react";

import { useLeaderboard } from "./useLeaderboard";
import { BackButton } from "../BackButton";

export const Leaderboard = () => {
  const { allTime, monthly, month } = useLeaderboard();

  return (
    <Flex
      justifyContent="center"
      bgColor="gray.700"
      height="100%"
      padding="24px"
    >
      <Stack spacing="64px">
        <Stack>
          <Text
            color="white"
            fontWeight="bold"
            fontSize="4xl"
            textAlign="center"
          >
            BioWordle Leaderboard
          </Text>
          <BackButton />
        </Stack>

        <div>
          <Text
            color="white"
            fontWeight="bold"
            fontSize="3xl"
            textAlign="center"
          >
            All Time Leaders
          </Text>
          {allTime?.map((score) => (
            <Text color="gray.100" key={score.userId} textAlign="center">
              {score.userId}: {score.value}
            </Text>
          ))}
        </div>

        <div>
          <Text
            color="white"
            fontWeight="bold"
            fontSize="3xl"
            textAlign="center"
          >
            {month} Leaders
          </Text>
          {monthly?.map((score) => (
            <Text color="gray.100" key={score.userId} textAlign="center">
              {score.userId}: {score.value}
            </Text>
          ))}
        </div>
      </Stack>
    </Flex>
  );
};
