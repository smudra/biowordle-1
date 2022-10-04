import { Box, Flex, Icon, Heading } from "@chakra-ui/react";
import { MdHelpOutline, MdBarChart } from "react-icons/md";

import { Keyboard } from "./Keyboard";

export const Game = () => {
  return (
    <Flex
      bgColor="rgb(18, 18, 19)"
      alignItems="center"
      flexDirection="column"
      height="100%"
      width="100%"
    >
      <Flex
        alignItems="center"
        width="95%"
        maxWidth="500px"
        height="100%"
        flexDirection="column"
      >
        <Flex
          alignItems="center"
          justifyContent="space-between"
          borderBottom="1px solid rgb(58, 58, 60)"
          width="100%"
          padding="12px"
        >
          <Icon as={MdHelpOutline} color="#fff" boxSize="24px" />
          <Heading as="h1" color="#fff" margin="0">
            Bio Wordle
          </Heading>
          <Icon as={MdBarChart} color="#fff" boxSize="24px" />
        </Flex>

        <Keyboard />
      </Flex>
    </Flex>
  );
};
