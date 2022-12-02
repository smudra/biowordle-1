import { ReactNode, useEffect, useCallback } from "react";
import { Box, Center } from "@chakra-ui/react";
import type { ButtonProps } from "@chakra-ui/react";

import { TileColors } from "./Game";

const KEYS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
];

const DELETE = "DEL";
const ENTER = "ENTER";

type KeyProps = {
  color?: TileColors;
  value: string;
  flex?: ButtonProps["flex"];
  onClick(value: string): void;
};

const Key = ({ color, value, flex = "1", onClick }: KeyProps) => (
  <Center
    backgroundColor={color || "rgb(129, 131, 132)"}
    border="0"
    borderRadius="4px"
    color="rgb(215, 218, 220)"
    cursor="pointer"
    fontFamily="inherit"
    fontWeight="bold"
    height="58px"
    minWidth={["20px", "40px"]}
    marginRight="6px"
    textTransform="uppercase"
    userSelect="none"
    fontSize={["12px", "16px"]}
    onClick={() => onClick(value)}
    {...{ flex, value }}
  >
    {value}
  </Center>
);

const KeyboardRow = ({ children }: { children: ReactNode }) => (
  <Box
    __css={{ touchAction: "manipulation" }}
    display="flex"
    justifyContent="center"
    margin="0 auto 8px"
    width="100%"
  >
    {children}
  </Box>
);

type KeyboardProps = {
  keyColours: {
    [key: string]: TileColors;
  };
  onDelete?(): void;
  onEnter(): void;
  onLetterSelect(val: string): void;
};

export const Keyboard = (props: KeyboardProps) => {
  const { keyColours, onDelete, onEnter, onLetterSelect } = props;

  const handleClick = (value: string) => {
    if (value === DELETE) {
      onDelete?.();
    } else if (value === ENTER) {
      onEnter();
    } else {
      onLetterSelect(value);
    }
  };

  const handleKeyPress = useCallback(
    ({ key }: KeyboardEvent) => {
      if (key === "Backspace") {
        onDelete?.();
      } else if (key === "Enter") {
        onEnter();
      } else {
        const match = /^[a-zA-Z]+$/.test(key);
        if (match && key.length === 1) {
          onLetterSelect(key);
        }
      }
    },
    [onDelete, onEnter, onLetterSelect]
  );

  useEffect(() => {
    window.addEventListener("keyup", handleKeyPress);

    return () => window.removeEventListener("keyup", handleKeyPress);
  }, [handleKeyPress, onDelete]);

  return (
    <Box height="200px" width="100%">
      <KeyboardRow>
        {KEYS[0].map((key) => (
          <Key
            color={keyColours[key]}
            key={key}
            value={key}
            onClick={handleClick}
          />
        ))}
      </KeyboardRow>
      <KeyboardRow>
        <Box flexGrow={0.5} />
        {KEYS[1].map((key) => (
          <Key
            color={keyColours[key]}
            key={key}
            value={key}
            onClick={handleClick}
          />
        ))}
        <Box flexGrow={0.5} />
      </KeyboardRow>
      <KeyboardRow>
        <Key value={ENTER} flex={1.5} onClick={handleClick} />
        {KEYS[2].map((key) => (
          <Key
            color={keyColours[key]}
            key={key}
            value={key}
            onClick={handleClick}
          />
        ))}
        <Key value={DELETE} flex={1.5} onClick={handleClick} />
      </KeyboardRow>
    </Box>
  );
};
