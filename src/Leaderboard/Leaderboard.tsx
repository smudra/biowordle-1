import {
  Text,
  Flex,
  Stack,
  Thead,
  Th,
  TableContainer,
  Table,
  Tbody,
  Tr,
  Td,
} from "@chakra-ui/react";

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
            All Time Top 10
          </Text>
          <TableContainer width={["100%", "600px"]}>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th color="gray.300">User</Th>
                  <Th color="gray.300" isNumeric>
                    Score
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {allTime?.map((score) => (
                  <Tr key={score.userId}>
                    <Td color="gray.100">{score.email || score.name}</Td>
                    <Td color="gray.100" isNumeric>
                      {score.value}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </div>

        <div>
          <Text
            color="white"
            fontWeight="bold"
            fontSize="3xl"
            textAlign="center"
          >
            {month} Top 10
          </Text>
          <TableContainer width={["100%", "600px"]}>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th color="gray.300">User</Th>
                  <Th color="gray.300" isNumeric>
                    Score
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {monthly?.map((score) => (
                  <Tr key={score.userId}>
                    <Td color="gray.100">{score.email || score.name}</Td>
                    <Td color="gray.100" isNumeric>
                      {score.value}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </div>
      </Stack>
    </Flex>
  );
};
