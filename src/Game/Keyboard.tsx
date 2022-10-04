import { ReactNode } from "react";
import { Box, Button, Flex } from "@chakra-ui/react";
import type { ButtonProps } from "@chakra-ui/react";
const keys = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
];

const Key = ({
  value,
  flexGrow,
}: {
  value: string;
  flexGrow?: ButtonProps["flexGrow"];
}) => (
  <Button
    fontFamily="inherit"
    fontWeight="bold"
    border="0"
    padding="0"
    marginRight="6px"
    height="58px"
    borderRadius="4px"
    cursor="pointer"
    userSelect="none"
    backgroundColor="rgb(129, 131, 132)"
    color="rgb(215, 218, 220)"
    flexGrow={flexGrow || "1"}
    display="flex"
    justifyContent="center"
    alignItems="center"
    textTransform="uppercase"
    data-key={value}
  >
    {value}
  </Button>
);

const KeyboardRow = ({ children }: { children: ReactNode }) => (
  <Box
    display="flex"
    justifyContent="center"
    width="100%"
    margin="0 auto 8px"
    __css={{ touchAction: "manipulation" }}
  >
    {children}
  </Box>
);

export const Keyboard = () => {
  return (
    <Box height="200px" width="100%">
      <KeyboardRow>
        {keys[0].map((key) => (
          <Key {...{ key }} value={key} />
        ))}
      </KeyboardRow>
      <KeyboardRow>
        <Box flexGrow={0.5} />
        {keys[1].map((key) => (
          <Key {...{ key }} value={key} />
        ))}
        <Box flexGrow={0.5} />
      </KeyboardRow>
      <KeyboardRow>
        <Key value={"ENTER"} flexGrow={1.5} />
        {keys[2].map((key) => (
          <Key {...{ key }} value={key} />
        ))}
        <Key value={"DEL"} flexGrow={1.5} />
      </KeyboardRow>
    </Box>
  );
};
