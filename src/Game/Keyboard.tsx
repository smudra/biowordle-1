import { ReactNode, MouseEvent } from "react";
import { Box, Button } from "@chakra-ui/react";
import type { ButtonProps } from "@chakra-ui/react";

const KEYS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
];

const DELETE = "DEL";
const ENTER = "ENTER";

type KeyProps = {
  value: string;
  flex?: ButtonProps["flex"];
  onClick(event: MouseEvent<HTMLButtonElement>): void;
};

const Key = ({ value, flex = "1", onClick }: KeyProps) => (
  <Button
    backgroundColor="rgb(129, 131, 132)"
    border="0"
    borderRadius="4px"
    color="rgb(215, 218, 220)"
    cursor="pointer"
    fontFamily="inherit"
    fontWeight="bold"
    height="58px"
    marginRight="6px"
    textTransform="uppercase"
    userSelect="none"
    {...{ flex, onClick, value }}
  >
    {value}
  </Button>
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

export const Keyboard = ({ onDelete, onEnter, onLetterSelect }) => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    const { value } = event.target as HTMLButtonElement;

    if (value === DELETE) {
      onDelete();
    } else if (value === ENTER) {
      onEnter();
    } else {
      onLetterSelect(value);
    }
  };

  return (
    <Box height="200px" width="100%">
      <KeyboardRow>
        {KEYS[0].map((key) => (
          <Key {...{ key }} value={key} onClick={handleClick} />
        ))}
      </KeyboardRow>
      <KeyboardRow>
        <Box flexGrow={0.5} />
        {KEYS[1].map((key) => (
          <Key {...{ key }} value={key} onClick={handleClick} />
        ))}
        <Box flexGrow={0.5} />
      </KeyboardRow>
      <KeyboardRow>
        <Key value={ENTER} flex={1.5} onClick={handleClick} />
        {KEYS[2].map((key) => (
          <Key {...{ key }} value={key} onClick={handleClick} />
        ))}
        <Key value={DELETE} flex={1.5} onClick={handleClick} />
      </KeyboardRow>
    </Box>
  );
};
