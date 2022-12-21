import { useEffect, useRef, useState } from "react";
import { Flex, useBoolean, Box, Center } from "@chakra-ui/react";
import clsx from "clsx";
import "animate.css";

import { TileColors } from "./Game";

type Props = {
  guessedLetters: string[];
  tileColors: TileColors[];
  wordLength: number;
  wrongWordIndices: number[];
};

export const GameBoard = (props: Props) => {
  const { guessedLetters, tileColors, wordLength, wrongWordIndices } = props;
  const [isVisible, setVisibility] = useBoolean();

  const squareRef = useRef(null);

  const [fontSize, setFontSize] = useState("");

  const getFontSize = () => {
    if (!squareRef.current) return;

    const divRef: HTMLDivElement = squareRef.current;
    const squareWidth = divRef.clientWidth;
    setFontSize(`${squareWidth / 2}px`);
  };

  useEffect(() => {
    window.addEventListener("resize", getFontSize);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setVisibility.on();
    }, 500);
  }, [setVisibility]);

  useEffect(() => {
    if (isVisible) {
      getFontSize();
    }
  }, [isVisible]);

  const shouldShake = (index: number) => {
    if (!wrongWordIndices.length) return false;
    const [firstIndex, lastIndex] = wrongWordIndices;
    return index >= firstIndex && index <= lastIndex;
  };

  const baseWidth = wordLength > 6 ? "100%" : "80%";

  return (
    <Flex
      justifyContent="center"
      align-items="center"
      flexGrow="1"
      overflowY="auto"
      flexDirection="column"
      width={["100%", baseWidth]}
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
                animate__shakeX: shouldShake(i),
              })}
              color="gainsboro"
              cursor="pointer"
              fontSize={fontSize}
              fontWeight="bold"
              key={i.toString()}
              width="100%"
              textTransform="uppercase"
              userSelect="none"
              bgColor={tileColors[i]}
              borderColor={tileColors[i]}
              ref={squareRef}
              __css={{ aspectRatio: "1/1" }}
            >
              {guessedLetters[i]}
            </Center>
          ))}
      </Box>
    </Flex>
  );
};
