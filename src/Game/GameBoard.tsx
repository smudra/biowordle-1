import { useEffect } from "react";
import { Flex, useBoolean, Box, Center } from "@chakra-ui/react";
import clsx from "clsx";
import "animate.css";

import { TileColors } from "./Game";

type Props = {
  guessedLetters: string[];
  tileColors: TileColors[];
  wordLength: number;
};

export const GameBoard = ({
  guessedLetters,
  tileColors,
  wordLength,
}: Props) => {
  const [isVisible, setVisibility] = useBoolean();

  useEffect(() => {
    setTimeout(() => {
      setVisibility.on();
    }, 500);
  }, []);

  return (
    <Flex
      justifyContent="center"
      align-items="center"
      flexGrow="1"
      overflow="hidden"
      flexDirection="column"
    >
      <Box
        boxSizing="border-box"
        display="grid"
        gridGap="5px"
        gridTemplateColumns={`repeat(${wordLength}, 1fr)`}
        padding="10px"
        alignItems="center"
      >
        {isVisible &&
          Array.from({ length: wordLength * 6 }).map((_, i) => (
            <Center
              border="2px solid rgb(58, 58, 60)"
              boxSizing="border-box"
              className={clsx("animate__animated", {
                animate__pulse: !!guessedLetters[i],
                animate__flipInX: !!tileColors[i],
              })}
              color="gainsboro"
              cursor="pointer"
              fontSize="2rem"
              fontWeight="bold"
              key={i.toString()}
              minHeight="60px"
              minWidth="60px"
              textTransform="uppercase"
              userSelect="none"
              bgColor={tileColors[i]}
              borderColor={tileColors[i]}
            >
              {guessedLetters[i]}
            </Center>
          ))}
      </Box>
    </Flex>
  );
};
