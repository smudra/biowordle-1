import { Text, Box } from "@chakra-ui/react";

type Props = {
  label: string;
  stat: number;
};

export const StatBox = ({ label, stat }: Props) => (
  <Box>
    <Text
      color="gray.100"
      fontSize="82px"
      fontWeight="bold"
      textAlign="center"
      lineHeight="70px"
    >
      {stat}
    </Text>
    <Text color="gray.300" fontSize="24px" textAlign="center">
      {label}
    </Text>
  </Box>
);
